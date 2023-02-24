import BackLinkRow from "@/components/BackLinkRow";
import ProdInstance, { NotFoundAPIResponseError } from "@/models/api";
import { getStatus } from "@/models/api/mastodon/status";
import { buildWebFingerAccountString, decomposeWebFingerAccount, resolveWebFingerDomainPart } from "@/models/webfinger";
import singleCardStyle from "@/styles/components/singleCard.module.scss";
import { ellipsisText, stripTags } from "@/utils";
import dayjs from "dayjs";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo } from "react";

async function getPost(acct: string, postid: string) {
  const instance = new ProdInstance();
  try {
    const status = await getStatus(postid).send(instance);
    const fullAccountPath = buildWebFingerAccountString(
      await resolveWebFingerDomainPart(decomposeWebFingerAccount(status.account.acct), instance)
    );

    return { status, fullAccountPath };
  } catch (e) {
    if (e instanceof NotFoundAPIResponseError) {
      notFound();
    } else {
      throw e;
    }
  }
}

function LocaleFormattedDate({ children }: { readonly children: string }) {
  // TODO: あとでbrowser localeを考慮した形に修正する たぶんそうするとuse clientが必要になるはず
  const date = useMemo(() => dayjs(children), [children]);

  return <span>{date.format()}</span>;
}

export async function generateMetadata({
  params,
}: {
  readonly params: { readonly acct: string; readonly postid: string };
}): Promise<Metadata> {
  const { status } = await getPost(decodeURIComponent(params.acct), decodeURIComponent(params.postid));

  return {
    title: `${status.account.display_name}: "${ellipsisText(
      status.spoiler_text || status.text || stripTags(status.content)
    )}" - Lunarlight`,
  };
}

export default async function SinglePostPage({
  params,
}: {
  readonly params: { readonly acct: string; readonly postid: string };
}) {
  const { status, fullAccountPath } = await getPost(decodeURIComponent(params.acct), decodeURIComponent(params.postid));

  return (
    <>
      <main>
        <BackLinkRow />
        <article className={singleCardStyle.singleCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={singleCardStyle.avatarImage} src={status.account.avatar} alt={fullAccountPath} />
          <h1>
            <Link href={`/@${status.account.acct}`}>{status.account.display_name}</Link>
          </h1>
          <h2>
            <Link href={`/@${status.account.acct}`}>@{fullAccountPath}</Link>
          </h2>
          <div className={singleCardStyle.content} dangerouslySetInnerHTML={{ __html: status.content }} />
          <div className={singleCardStyle.footer}>
            {status.application ? (
              <>
                {status.application.website ? (
                  <a href={status.application.website}>{status.application.name}</a>
                ) : (
                  status.application.name
                )}
                ・
              </>
            ) : (
              ""
            )}
            <LocaleFormattedDate>{status.created_at}</LocaleFormattedDate>
          </div>
        </article>
      </main>
    </>
  );
}

import BackLinkRow from "@/components/BackLinkRow";
import Header from "@/components/Header";
import ProdInstance, { NotFoundAPIResponseError } from "@/models/api";
import { getInstanceData } from "@/models/api/mastodon/instance";
import { getStatus, isRemoteAccount } from "@/models/api/mastodon/status";
import singleCardStyle from "@/styles/components/singleCard.module.scss";
import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo } from "react";

async function getPost(acct: string, postid: string) {
  const instance = new ProdInstance();
  try {
    const status = await getStatus(postid).send(instance);
    const full_account_path = isRemoteAccount(status.account)
      ? status.account.acct
      : await getInstanceData.send(instance).then((x) => `${status.account.username}@${x.domain}`);

    return { status, full_account_path };
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

export default async function SinglePostPage({
  params,
}: {
  readonly params: { readonly acct: string; readonly postid: string };
}) {
  const { status, full_account_path } = await getPost(
    decodeURIComponent(params.acct),
    decodeURIComponent(params.postid)
  );

  return (
    <>
      <Header />
      <main>
        <BackLinkRow />
        <article className={singleCardStyle.singleCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={singleCardStyle.avatarImage} src={status.account.avatar} alt={full_account_path} />
          <h1>
            <Link href={`/@${status.account.acct}`}>{status.account.display_name}</Link>
          </h1>
          <h2>
            <Link href={`/@${status.account.acct}`}>@{full_account_path}</Link>
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

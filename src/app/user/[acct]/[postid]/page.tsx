import BackLinkRow from "@/components/BackLinkRow";
import DateTimeLabel from "@/components/DateTimeLabel";
import StatusActions from "@/components/StatusActions";
import ProdInstance, { EmptyRequestBody, HTTPError } from "@/models/api";
import { getStatus } from "@/models/api/mastodon/status";
import { RebloggedStatus, Status } from "@/models/status";
import Webfinger from "@/models/webfinger";
import singleCardStyle from "@/styles/components/singleCard.module.scss";
import { ellipsisText } from "@/utils";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getPost(_acct: string, postid: string) {
  const instance = new ProdInstance();
  try {
    const status = Status.fromApiData(await getStatus(postid).send(EmptyRequestBody.instance, instance));
    const fullAcct = await Webfinger.Address.decompose(status.account.acct).resolveDomainPart(instance);

    return { status, fullAccountPath: fullAcct.toString() };
  } catch (e) {
    if (e instanceof HTTPError.NotFoundError) {
      notFound();
    } else {
      throw e;
    }
  }
}

export async function generateMetadata({
  params,
}: {
  readonly params: { readonly acct: string; readonly postid: string };
}): Promise<Metadata> {
  const { status } = await getPost(decodeURIComponent(params.acct), decodeURIComponent(params.postid));

  return {
    title: `${status.account.display_name}: "${ellipsisText(status.spoiler)}"`,
  };
}

export default async function SinglePostPage({
  params,
}: {
  readonly params: { readonly acct: string; readonly postid: string };
}) {
  const { status, fullAccountPath } = await getPost(decodeURIComponent(params.acct), decodeURIComponent(params.postid));
  console.log(status);

  return (
    <>
      <BackLinkRow />
      <article className={singleCardStyle.singleCard}>
        {status instanceof RebloggedStatus ? (
          <p className={singleCardStyle.rebloggedBy}>
            Boosted by{" "}
            <Link href={`/@${status.rebloggedBy.acct}`} className="sub-colored">
              {status.rebloggedBy.display_name}
            </Link>
          </p>
        ) : undefined}
        <Link className={`${singleCardStyle.avatarImage} clickableImage`} href={`/@${status.account.acct}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={status.account.avatar} alt={fullAccountPath} />
        </Link>
        <h1>
          <Link className="non-colored" href={`/@${status.account.acct}`}>
            {status.account.display_name}
          </Link>
        </h1>
        <h2>
          <Link className="sub-colored" href={`/@${status.account.acct}`}>
            @{fullAccountPath}
          </Link>
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
          <DateTimeLabel at={status.created_at} />
        </div>
        <div className={singleCardStyle.actions}>
          <StatusActions status={status} />
        </div>
      </article>
    </>
  );
}

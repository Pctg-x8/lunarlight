import BackLinkRow from "@/components/BackLinkRow";
import DateTimeLabel from "@/components/DateTimeLabel";
import StatusActions from "@/components/StatusActions";
import { DefaultInstance, EmptyRequestBody, HTTPError } from "@/models/api";
import { getStatus } from "@/models/api/mastodon/status";
import { RebloggedStatus, Status } from "@/models/status";
import singleCardStyle from "@/styles/components/singleCard.module.scss";
import { ellipsisText } from "@/utils";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getPost(_acct: string, postid: string): Promise<Status> {
  try {
    return Status.fromApiData(await getStatus(postid).send(EmptyRequestBody.instance, DefaultInstance));
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
  const status = await getPost(decodeURIComponent(params.acct), decodeURIComponent(params.postid));

  return {
    title: `${status.account.displayName}: "${ellipsisText(status.spoiler)}"`,
  };
}

export default async function SinglePostPage({
  params,
}: {
  readonly params: { readonly acct: string; readonly postid: string };
}): Promise<JSX.Element> {
  const status = await getPost(decodeURIComponent(params.acct), decodeURIComponent(params.postid));
  const fullAccountPath = (await status.account.fullAcct(DefaultInstance)).toString();

  return (
    <>
      <BackLinkRow />
      <article className={singleCardStyle.singleCard}>
        {status instanceof RebloggedStatus ? (
          <p className={singleCardStyle.rebloggedBy}>
            <FontAwesomeIcon icon={faRetweet} className={singleCardStyle.icon} />
            Boosted by{" "}
            <Link href={status.rebloggedBy.pagePath} className="sub-colored">
              {status.rebloggedBy.displayName}
            </Link>
          </p>
        ) : undefined}
        <Link className={`${singleCardStyle.avatarImage} clickableImage`} href={`/@${status.account.acct}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={status.account.avatarUrl} alt={fullAccountPath} />
        </Link>
        <h1>
          <Link className="non-colored" href={`/@${status.account.acct}`}>
            {status.account.displayName}
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

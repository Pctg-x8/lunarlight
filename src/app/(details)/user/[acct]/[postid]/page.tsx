import BackLinkRow from "@/components/BackLinkRow";
import DateTimeLabel from "@/components/DateTimeLabel";
import StatusActions from "@/components/StatusActions";
import { transformDisplayNameTags } from "@/components/domTransformer/emoji";
import { DefaultInstance, HTTPError } from "@/models/api";
import { ssrGetAuthorizationToken } from "@/models/auth";
import EmojiResolver from "@/models/emoji";
import { RebloggedStatus, Status } from "@/models/status";
import { ellipsisText, isDefined } from "@/utils";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@styled-system/css";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageParams = {
  readonly acct: string;
  readonly postid: string;
};

async function getPost(_acct: string, postid: string) {
  const token = ssrGetAuthorizationToken();
  const instance = isDefined(token) ? DefaultInstance.withAuthorizationToken(token) : DefaultInstance;

  try {
    return await Status.get(postid, { instance }).then(s => s.resolveEmojis(new EmojiResolver(), instance));
  } catch (e) {
    if (e instanceof HTTPError.NotFoundError) {
      notFound();
    } else {
      throw e;
    }
  }
}

export async function generateMetadata({ params }: { readonly params: PageParams }): Promise<Metadata> {
  const status = await getPost(decodeURIComponent(params.acct), decodeURIComponent(params.postid));

  return {
    title: `${status.account.displayName}: "${ellipsisText(status.spoiler)}"`,
  };
}

export default async function SinglePostPage({ params }: { readonly params: PageParams }): Promise<JSX.Element> {
  const status = await getPost(decodeURIComponent(params.acct), decodeURIComponent(params.postid));
  const fullAccountPath = (await status.account.fullAcct(DefaultInstance)).toString();

  return (
    <>
      <BackLinkRow />
      <article className={SingleCardStyle}>
        {status instanceof RebloggedStatus ? (
          <p className="rebloggedBy">
            <FontAwesomeIcon icon={faRetweet} className="icon" />
            Boosted by{" "}
            <Link href={status.rebloggedBy.pagePath} className="sub-colored">
              {status.rebloggedBy.displayName}
            </Link>
          </p>
        ) : undefined}
        <Link className="avatarImage" href={`/@${status.account.acct}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={status.account.avatarUrl} alt={fullAccountPath} />
        </Link>
        <h1 className="displayName">
          <Link className="non-colored" href={`/@${status.account.acct}`}>
            {transformDisplayNameTags(status.account)}
          </Link>
        </h1>
        <h2 className="accountFullname">
          <Link className="sub-colored" href={`/@${status.account.acct}`}>
            @{fullAccountPath}
          </Link>
        </h2>
        <div className="content" dangerouslySetInnerHTML={{ __html: status.content }} />
        <div className="footer">
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
        <div className="actions">
          <StatusActions status={status} />
        </div>
      </article>
    </>
  );
}

const SingleCardStyle = css({
  padding: "16px",
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gridTemplateAreas:
    '"space reblogged_by" "avatar display_name" "avatar account_fullname" "content content" "footer footer" "actions actions"',
  background: "status.background.default",
  "& .displayName": {
    gridArea: "display_name",
    fontSize: "1.5rem",
    fontWeight: "bolder",
    pl: "4px",
  },
  "& .accountFullname": {
    gridArea: "account_fullname",
    color: "app.subtext",
    fontSize: "1rem",
    fontWeight: "normal",
    pl: "4px",
  },
  "& .rebloggedBy": {
    gridArea: "reblogged_by",
    mb: "8px",
    fontSize: "0.75rem",
    fontWeight: "bolder",
    fontStyle: "italic",
    color: "app.subtext",
    "& > .icon": {
      fontSize: "125%",
      mr: "0.4em",
    },
  },
  "& .avatarImage": {
    gridArea: "avatar",
    mr: "4px",
    "& > img": {
      width: "auto",
      height: "48px",
      objectFit: "cover",
      borderRadius: "4px",
    },
  },
  "& .content": {
    gridArea: "content",
    p: "8px",
    "& img": {
      display: "inline-block",
      height: "1.5em",
    },
  },
  "& .footer": {
    gridArea: "footer",
    color: "app.subtext",
    fontSize: "0.8rem",
    ml: "8px",
  },
  "& .actions": {
    gridArea: "actions",
    mt: "16px",
  },
});

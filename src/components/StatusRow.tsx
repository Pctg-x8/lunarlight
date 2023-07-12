import { TimelineMode } from "@/models/localPreferences";
import { RebloggedStatus, Status } from "@/models/status";
import { faReply, faRetweet, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@styled-system/css";
import Link from "next/link";
import { useEffect, useRef } from "react";
import AgoLabel from "./AgoLabel";
import StatusActions from "./StatusActions";

export default function StatusRow({
  status,
  mode,
  deleted = false,
  onPreview,
}: {
  readonly status: Status;
  readonly mode: TimelineMode;
  readonly deleted?: boolean;
  readonly onPreview: (status: Status) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!contentRef.current) return;

    const cancellation = new AbortController();
    function recursiveProcessLink(e: ChildNode) {
      if (e instanceof HTMLAnchorElement || e instanceof HTMLButtonElement) {
        e.addEventListener("click", e => e.stopPropagation(), { signal: cancellation.signal });
      }

      for (const child of e.childNodes) recursiveProcessLink(child);
    }
    for (const child of contentRef.current.childNodes) recursiveProcessLink(child);
    return () => cancellation.abort();
  }, [contentRef]);

  switch (mode) {
    case "normal":
      return (
        <article className={NormalStatusRow} ref={contentRef} onClick={() => onPreview(status)} data-deleted={deleted}>
          {status instanceof RebloggedStatus ? (
            <p className="rebloggedBy">
              <FontAwesomeIcon icon={faRetweet} className="icon" />
              Boosted by{" "}
              <Link href={status.rebloggedBy.pagePath} className="sub-colored">
                {status.rebloggedBy.displayName}
              </Link>
            </p>
          ) : undefined}
          <Link className="avatar clickableImage" href={status.account.pagePath}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={status.account.avatarUrl} alt={status.account.acct.toString()} />
          </Link>
          <h1 className="displayName">
            <Link className="non-colored" href={status.account.pagePath}>
              {status.account.displayName}
            </Link>
          </h1>
          <h2 className="acct">
            <Link className="sub-colored" href={status.account.pagePath}>
              @{status.account.acct.toString()}
            </Link>
          </h2>
          <AgoLabel className="ago" createdAt={status.created_at} />
          <div className="text" dangerouslySetInnerHTML={{ __html: status.content }} />
          <div className="statusActions">
            <StatusActions status={status} disabled={deleted} />
          </div>
        </article>
      );
    case "expert":
      return (
        <article className={ExpertStatusRow} ref={contentRef} onClick={() => onPreview(status)} data-deleted={deleted}>
          <h1 className="displayName">
            <Link
              className="non-colored"
              href={status.account.pagePath}
              title={`${status.account.displayName} (@${status.account.acct.toString()})`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={status.account.avatarUrl} alt={status.account.acct.toString()} />
              {status.account.displayName}
            </Link>
          </h1>
          <div className="rebloggedIcon">
            {status instanceof RebloggedStatus ? (
              <Link
                href={status.rebloggedBy.pagePath}
                className="sub-colored"
                title={`Boosted by ${status.rebloggedBy.displayName}`}
              >
                <FontAwesomeIcon icon={faRetweet} className="icon" />
              </Link>
            ) : undefined}
          </div>
          <div className="text" dangerouslySetInnerHTML={{ __html: status.content }} />
          <button title={`返信(${status.counters.replied})`} className="reply ab" disabled={deleted}>
            <FontAwesomeIcon icon={faReply} />
          </button>
          <button title={`ふぁぼ(${status.counters.favorited})`} className="fav ab" disabled={deleted}>
            <FontAwesomeIcon icon={faStar} />
          </button>
          <button title={`ブースト(${status.counters.reblogged})`} className="reb ab" disabled={deleted}>
            <FontAwesomeIcon icon={faRetweet} />
          </button>
          <AgoLabel className="ago" createdAt={status.created_at} />
        </article>
      );
  }
}

const ExpertStatusRow = css({
  display: "grid",
  // TODO: nameの160pxはそのうち調整可能にしたい
  gridTemplateColumns: "160px auto 1fr auto auto auto auto",
  gridTemplateAreas: '"name reblogged text reply fav reb ago"',
  alignItems: "baseline",
  fontSize: "12px",
  padding: "3px",
  background: "status.background.default",
  cursor: "pointer",
  transition: "background 0.1s ease",
  _hover: {
    background: "status.background.accent",
  },
  "& .displayName": {
    gridArea: "name",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "pre",
    "& img": {
      display: "inline",
      height: "1em",
      marginRight: "4px",
    },
  },
  "& .rebloggedIcon": {
    gridArea: "reblogged",
    width: "1em",
    margin: "0 4px",
  },
  "& .ago": {
    gridArea: "ago",
    fontSize: "0.8rem",
    width: "50px",
    textAlign: "right",
    whiteSpace: "pre",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  "& .text": {
    gridArea: "text",
    whiteSpace: "pre",
    overflow: "hidden",
    "& > *": {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  "& .reply": {
    gridArea: "reply",
  },
  "& .fav": {
    gridArea: "fav",
  },
  "& ,reb": {
    gridArea: "reb",
  },
  "& .ab": {
    padding: "0px 2px",
    color: "status.actions.default",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "color 0.15s ease",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    _hover: {
      color: "status.actions.lit",
    },
  },
  _deleted: {
    textDecoration: "line-through",
    opacity: 0.5,
  },
});

const NormalStatusRow = css({
  display: "grid",
  gridTemplateAreas:
    '"space2 rebloggedBy rebloggedBy rebloggedBy ago" "image displayName acct space ago" "image text text text text" "a a a a a"',
  gridTemplateColumns: "auto auto auto 1fr auto",
  padding: "12px",
  paddingBottom: "8px",
  background: "status.background.default",
  cursor: "pointer",
  transition: "background 0.1s ease",
  _hover: {
    background: "status.background.accent",
  },
  "& .rebloggedBy": {
    gridArea: "rebloggedBy",
    fontSize: "75%",
    fontWeight: "bolder",
    fontStyle: "italic",
    marginBottom: "8px",
    color: "app.subtext",
    "& > .icon": {
      fontSize: "125%",
      marginRight: "0.4em",
    },
  },
  "& .avatar": {
    gridArea: "image",
    marginRight: "8px",
    "& > img": {
      height: "36px",
      width: "36px",
      borderRadius: "4px",
    },
  },
  "& .displayName": {
    gridArea: "displayName",
    fontSize: "14px",
    alignSelf: "baseline",
  },
  "& .acct": {
    gridArea: "acct",
    fontWeight: "normal",
    color: "app.subtext",
    fontStyle: "italic",
    alignSelf: "baesline",
    marginLeft: "4px",
  },
  "& .ago": {
    gridArea: "ago",
    color: "app.subtext",
  },
  "& .text": {
    gridArea: "text",
    margin: "6px 2px",
    marginBottom: "8px",
  },
  "& .statusActions": {
    gridArea: "a",
    marginTop: "4px",
  },
  _deleted: {
    textDecoration: "line-through",
    opacity: 0.5,
  },
});

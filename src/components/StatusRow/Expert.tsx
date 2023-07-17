import { RebloggedStatus, Status } from "@/models/status";
import { TextStyle } from "@/styles/StatusRowSharedStyles";
import { recursiveProcessDOMNodes } from "@/utils/DOMRecursiveProcessor";
import { faReply, faRetweet, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, cx } from "@styled-system/css";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import AgoLabel from "../AgoLabel";

export default function ExpertStatusRow({
  status,
  deleted = false,
  onPreview,
}: {
  readonly status: Status;
  readonly deleted?: boolean;
  readonly onPreview: (status: Status) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const cancellation = new AbortController();
    recursiveProcessDOMNodes(contentRef.current, e => {
      if (e instanceof HTMLAnchorElement || e instanceof HTMLButtonElement) {
        e.addEventListener("click", e => e.stopPropagation(), { signal: cancellation.signal });
      }
    });

    return () => cancellation.abort();
  }, [contentRef]);

  return (
    <article className={MainStyle} ref={contentRef} onClick={() => onPreview(status)} data-deleted={deleted}>
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
      <div className={cx("text", TextStyle)} dangerouslySetInnerHTML={{ __html: status.content }} />
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

const MainStyle = css({
  display: "grid",
  // TODO: nameの160pxはそのうち調整可能にしたい
  gridTemplateColumns: "160px auto 1fr auto auto auto auto",
  gridTemplateAreas: '"name reblogged text reply fav reb ago"',
  alignItems: "baseline",
  fontSize: "12px",
  padding: "3px",
  background: { base: "status.background.default", _hover: "status.background.accent" },
  cursor: "pointer",
  transition: "background 0.1s ease",
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

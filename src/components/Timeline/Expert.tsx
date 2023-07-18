import LocalPreferences from "@/models/localPreferences";
import { RebloggedStatus, Status } from "@/models/status";
import { TextStyle } from "@/styles/StatusRowSharedStyles";
import { isDefined } from "@/utils";
import { recursiveProcessDOMNodes } from "@/utils/DOMRecursiveProcessor";
import { faReply, faRetweet, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, cx } from "@styled-system/css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useLayoutEffect, useRef } from "react";
import AgoLabel from "../AgoLabel";

function Header({ onDisplayNameWidthChanged }: { readonly onDisplayNameWidthChanged: (newWidth: number) => void }) {
  const contentRef = useRef<HTMLLIElement>(null);
  const displayNameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!displayNameRef.current) return;

    let lastWidth = displayNameRef.current.getBoundingClientRect().width;
    const observer = new MutationObserver(e => {
      const event = e[0];
      if (!event) return;

      const w = (event.target as HTMLDivElement).getBoundingClientRect().width;
      console.log("nw", w);
      if (lastWidth !== w) {
        // update
        onDisplayNameWidthChanged(w);
        lastWidth = w;
      }
    });
    observer.observe(displayNameRef.current, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, [displayNameRef, onDisplayNameWidthChanged]);

  return (
    <li className={cx(RowGridStyle, HeaderStyle)} ref={contentRef}>
      <h1 className="displayName" ref={displayNameRef}>
        Display Name
      </h1>
      <div className="rebloggedIcon"></div>
      <div className={cx("text", TextStyle)}>text</div>
      <div className="reply ab"></div>
      <div className="fav ab"></div>
      <div className="reb ab"></div>
      <div className="ago" />
    </li>
  );
}
function Row({
  status,
  deleted = false,
  onPreview,
}: {
  readonly status: Status;
  readonly deleted?: boolean;
  readonly onPreview: (status: Status) => void;
}) {
  const contentRef = useRef<HTMLLIElement>(null);

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
    <li
      className={cx(RowStyle, RowGridStyle)}
      ref={contentRef}
      onClick={() => onPreview(status)}
      data-deleted={deleted}
    >
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
    </li>
  );
}

export default function ExpertTimelineView({
  statuses,
  deletedIds,
}: {
  readonly statuses: Status[];
  readonly deletedIds?: Immutable.Set<string>;
}) {
  const hasDeleted = (s: Status) => isDefined(deletedIds) && deletedIds.has(s.timelineId);
  const nav = useRouter();
  const [displayNameWidth, setDisplayNameWidth] =
    LocalPreferences.EXPERT_TIMELINE_DISPLAY_NAME_WIDTH.useReactiveStore(160);

  return (
    <ul style={{ "--expert-timeline-dn-width": `${displayNameWidth}px` } as CSSProperties}>
      <Header onDisplayNameWidthChanged={setDisplayNameWidth} />
      {statuses.map(s => (
        <Row key={s.timelineId} status={s} deleted={hasDeleted(s)} onPreview={s => nav.push(s.previewPath)} />
      ))}
    </ul>
  );
}

const RowGridStyle = css({
  display: "grid",
  gridTemplateColumns: "var(--expert-timeline-dn-width, 160px) auto 1fr auto auto auto auto",
  gridTemplateAreas: '"name reblogged text reply fav reb ago"',
  alignItems: "baseline",
  fontSize: "12px",
  "& .displayName": {
    gridArea: "name",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "pre",
    minWidth: "64px",
    maxWidth: "80vw",
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
  "& .reb": {
    gridArea: "reb",
  },
});

const HeaderStyle = css({
  padding: "3px",
  "& .displayName": {
    resize: "horizontal",
    textAlign: "center",
  },
  "& .text": {
    textAlign: "center",
  },
});

const RowStyle = css({
  borderBottom: "1px solid",
  borderBottomColor: "status.border",
  padding: "3px",
  background: { base: "status.background.default", _hover: "status.background.accent" },
  cursor: "pointer",
  transition: "background 0.1s ease",
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

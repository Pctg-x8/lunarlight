import { RebloggedStatus, Status } from "@/models/status";
import { TextStyle } from "../styles/StatusRowSharedStyles";
import { isDefined } from "@/utils";
import { recursiveProcessDOMNodes } from "@/utils/DOMRecursiveProcessor";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, cx } from "@styled-system/css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import AgoLabel from "../AgoLabel";
import StatusActions from "../StatusActions";
import { transformDisplayNameTags } from "../domTransformer/emoji";

function Row({ status, deleted = false }: { readonly status: Status; readonly deleted?: boolean }) {
  const nav = useRouter();
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
    <li className={RowStyle} ref={contentRef} onClick={() => nav.push(status.previewPath)} data-deleted={deleted}>
      {status instanceof RebloggedStatus ? (
        <p className={RebloggedBy}>
          <FontAwesomeIcon icon={faRetweet} className="icon" />
          Boosted by <Link href={status.rebloggedBy.pagePath}>{transformDisplayNameTags(status.rebloggedBy)}</Link>
        </p>
      ) : undefined}
      <Link className={Avatar} href={status.account.pagePath}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={status.account.avatarUrl} alt={status.account.acct.toString()} />
      </Link>
      <h1 className={DisplayName}>
        <Link href={status.account.pagePath}>{transformDisplayNameTags(status.account)}</Link>
      </h1>
      <h2 className={Acct}>
        <Link href={status.account.pagePath}>@{status.account.acct.toString()}</Link>
      </h2>
      <AgoLabel className={Ago} createdAt={status.created_at} />
      <div className={cx(Text, TextStyle)} dangerouslySetInnerHTML={{ __html: status.content }} />
      <div className={ActionsArea}>
        <StatusActions status={status} disabled={deleted} />
      </div>
    </li>
  );
}

export default function NormalTimelineView({
  statuses,
  deletedIds,
}: {
  readonly statuses: Status[];
  readonly deletedIds?: Immutable.Set<string>;
}) {
  const hasDeleted = (s: Status) => isDefined(deletedIds) && deletedIds.has(s.timelineId);

  return (
    <ul>
      {statuses.map(s => (
        <Row key={s.timelineId} status={s} deleted={hasDeleted(s)} />
      ))}
    </ul>
  );
}

const RowStyle = css({
  borderBottom: "1px solid",
  borderBottomColor: "status.border",
  display: "grid",
  gridTemplateAreas:
    '"space2 rebloggedBy rebloggedBy rebloggedBy ago" "image displayName acct space ago" "image text text text text" "a a a a a"',
  gridTemplateColumns: "auto auto auto 1fr auto",
  padding: "12px",
  paddingBottom: "8px",
  background: { base: "status.background.default", _hover: "status.background.accent" },
  cursor: "pointer",
  transition: "background 0.1s ease",
  _deleted: {
    textDecoration: "line-through",
    opacity: 0.5,
    cursor: "default",
  },
});

const DisplayName = css({
  gridArea: "displayName",
  fontSize: "14px",
  alignSelf: "baseline",
});
const Acct = css({
  gridArea: "acct",
  fontWeight: "normal",
  color: "app.subtext",
  fontStyle: "italic",
  alignSelf: "baesline",
  marginLeft: "4px",
});
const Avatar = css({
  gridArea: "image",
  marginRight: "8px",
  "& > img": {
    height: "36px",
    width: "36px",
    borderRadius: "4px",
  },
});
const RebloggedBy = css({
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
});
const Ago = css({
  gridArea: "ago",
  color: "app.subtext",
});
const Text = css({
  gridArea: "text",
  marginBottom: "8px",
  margin: "6px 2px",
  "& img": {
    display: "inline-block",
    height: "1.25em",
  },
});
const ActionsArea = css({
  gridArea: "a",
  marginTop: "4px",
});

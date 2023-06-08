import { TimelineMode } from "@/models/localPreferences";
import { RebloggedStatus, Status } from "@/models/status";
import { faReply, faRetweet, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@linaria/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import AgoLabel from "./AgoLabel";
import StatusActions from "./StatusActions";

export default function StatusRow({
  status,
  mode,
  disabled = false,
}: {
  readonly status: Status;
  readonly mode: TimelineMode;
  readonly disabled?: boolean;
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

  const nav = useRouter();

  switch (mode) {
    case "normal":
      return (
        <NormalStatusRow ref={contentRef} onClick={() => nav.push(status.previewPath)}>
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
            <StatusActions status={status} disabled={disabled} />
          </div>
        </NormalStatusRow>
      );
    case "expert":
      return (
        <ExpertStatusRow ref={contentRef} onClick={() => nav.push(status.previewPath)}>
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
          <button title={`返信(${status.counters.replied})`} className="reply ab" disabled={disabled}>
            <FontAwesomeIcon icon={faReply} />
          </button>
          <button title={`ふぁぼ(${status.counters.favorited})`} className="fav ab" disabled={disabled}>
            <FontAwesomeIcon icon={faStar} />
          </button>
          <button title={`ブースト(${status.counters.reblogged})`} className="reb ab" disabled={disabled}>
            <FontAwesomeIcon icon={faRetweet} />
          </button>
          <AgoLabel className="ago" createdAt={status.created_at} />
        </ExpertStatusRow>
      );
  }
}

const ExpertStatusRow = styled.article`
  display: grid;
  grid-template-columns: auto auto 1fr auto auto auto auto;
  grid-template-areas: "name reblogged text reply fav reb ago";
  align-items: baseline;

  font-size: 12px;
  padding: 3px;
  background: var(--theme-single-card-bg);
  cursor: pointer;
  transition: background 0.1s ease;

  &:hover {
    background: var(--theme-single-card-bg-accent);
  }

  & .displayName {
    grid-area: name;
    width: 160px;
    font-size: unset;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre;

    & img {
      height: 1em;
      margin-right: 4px;
    }
  }

  & .rebloggedIcon {
    grid-area: reblogged;
    width: 1em;
    margin: 0 4px;
  }

  & .ago {
    grid-area: ago;
    font-size: 0.8rem;
    width: 50px;
    text-align: right;
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & .text {
    grid-area: text;
    white-space: pre;
    overflow: hidden;

    & > * {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  & .reply {
    grid-area: reply;
  }

  & .fav {
    grid-area: fav;
  }

  & .reb {
    grid-area: reb;
  }

  & .ab {
    margin: 0;
    padding: 0px 2px;
    border: none;
    color: var(--theme-status-actions);
    background: none;
    font-size: 1rem;
    cursor: pointer;
    transition: color 0.15s ease;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
      color: var(--theme-status-actions-lit);
    }
  }
`;

const NormalStatusRow = styled.article`
  display: grid;
  grid-template-areas:
    "space2 rebloggedBy rebloggedBy rebloggedBy ago"
    "image displayName acct space ago"
    "image text text text text"
    "a a a a a";
  grid-template-columns: auto auto auto 1fr auto;

  padding: 12px;
  padding-bottom: 8px;
  background: var(--theme-single-card-bg);
  cursor: pointer;
  transition: background 0.1s ease;

  &:hover {
    background: var(--theme-single-card-bg-accent);
  }

  & .rebloggedBy {
    grid-area: rebloggedBy;
    font-size: 75%;
    font-weight: bolder;
    font-style: italic;
    margin-bottom: 8px;
    color: var(--theme-subtext);

    & > .icon {
      font-size: 125%;
      margin-right: 0.4em;
    }
  }

  & .avatar {
    grid-area: image;
    margin-right: 8px;

    & > img {
      height: 36px;
      width: 36px;
      border-radius: 4px;
    }
  }

  & .displayName {
    grid-area: displayName;
    font-size: 14px;
    align-self: baseline;
  }

  & .acct {
    grid-area: acct;
    font-weight: normal;
    color: var(--theme-subtext);
    font-style: italic;
    font-size: 12px;
    align-self: baseline;
    margin-left: 4px;
  }

  & .ago {
    grid-area: ago;
    color: var(--theme-subtext);
    font-size: 12px;
  }

  & .text {
    grid-area: text;
    margin: 6px 2px;
    margin-bottom: 8px;
  }

  & .statusActions {
    grid-area: a;
    margin-top: 4px;
  }
`;

import { TimelineMode } from "@/models/localPreferences";
import { RebloggedStatus, Status } from "@/models/status";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@linaria/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import AgoLabel from "./AgoLabel";
import StatusActions from "./StatusActions";

export default function StatusRow({ status, mode }: { readonly status: Status; readonly mode: TimelineMode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!contentRef.current) return;

    const cancellation = new AbortController();
    function recursiveProcessLink(e: ChildNode) {
      if (e instanceof HTMLAnchorElement || e instanceof HTMLButtonElement) {
        e.addEventListener("click", (e) => e.stopPropagation(), { signal: cancellation.signal });
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
            <StatusActions status={status} />
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
          <div className="text" dangerouslySetInnerHTML={{ __html: status.content }} />
          <AgoLabel className="ago" createdAt={status.created_at} />
        </ExpertStatusRow>
      );
  }
}

const ExpertStatusRow = styled.article`
  display: grid;
  grid-template-columns: 160px 1fr auto;
  align-items: baseline;

  font-size: 12px;
  padding: 4px;
  background: var(--theme-single-card-bg);
  cursor: pointer;
  transition: background 0.1s ease;

  &:hover {
    background: var(--theme-single-card-bg-accent);
  }

  & .displayName {
    flex: 1;
    font-size: unset;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre;

    & img {
      height: 1em;
      margin-right: 4px;
    }
  }

  & .ago {
    font-size: 80%;
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

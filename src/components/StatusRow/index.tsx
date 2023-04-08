import { RebloggedStatus, Status } from "@/models/status";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import AgoLabel from "../AgoLabel";
import StatusActions from "../StatusActions";
import styles from "./styles.module.scss";

export default function StatusRow({ status }: { readonly status: Status }) {
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

  return (
    <article ref={contentRef} className={styles.statusRow} onClick={() => nav.push(status.previewPath)}>
      {status instanceof RebloggedStatus ? (
        <p className={styles.rebloggedBy}>
          <FontAwesomeIcon icon={faRetweet} className={styles.icon} />
          Boosted by{" "}
          <Link href={status.rebloggedBy.pagePath} className="sub-colored">
            {status.rebloggedBy.displayName}
          </Link>
        </p>
      ) : undefined}
      <Link className={`${styles.avatar} clickableImage`} href={status.account.pagePath}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={status.account.avatarUrl} alt={status.account.acct.toString()} />
      </Link>
      <h1 className={styles.displayName}>
        <Link className="non-colored" href={status.account.pagePath}>
          {status.account.displayName}
        </Link>
      </h1>
      <h2 className={styles.acct}>
        <Link className="sub-colored" href={status.account.pagePath}>
          @{status.account.acct.toString()}
        </Link>
      </h2>
      <AgoLabel className={styles.ago} createdAt={status.created_at} />
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: status.content }} />
      <div className={styles.statusActions}>
        <StatusActions status={status} />
      </div>
    </article>
  );
}

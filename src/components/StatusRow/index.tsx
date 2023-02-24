import { Status } from "@/models/api/mastodon/status";
import Link from "next/link";
import AgoLabel from "../AgoLabel";
import StatusActions from "../StatusActions";
import styles from "./styles.module.scss";

export default function StatusRow({ status }: { readonly status: Status }) {
  return (
    <article className={styles.statusRow}>
      <Link className={`${styles.avatar} clickableImage`} href={`/@${status.account.acct}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={status.account.avatar} alt={status.account.acct} />
      </Link>
      <h1 className={styles.displayName}>
        <Link className="non-colored" href={`/@${status.account.acct}`}>
          {status.account.display_name}
        </Link>
      </h1>
      <h2 className={styles.acct}>
        <Link className="sub-colored" href={`/@${status.account.acct}`}>
          @{status.account.acct}
        </Link>
      </h2>
      <AgoLabel className={styles.ago} createdAt={status.created_at} />
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: status.content }} />
      <StatusActions className={styles.statusActions} />
    </article>
  );
}

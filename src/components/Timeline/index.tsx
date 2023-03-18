import { Status } from "@/models/api/mastodon/status";
import StatusRow from "../StatusRow";
import styles from "./styles.module.scss";

export default function Timeline({ statuses }: { readonly statuses: Status[] }) {
  return (
    <ul className={styles.staticTimeline}>
      {statuses.map((s, x) => (
        <li key={x}>
          <StatusRow status={s} />
        </li>
      ))}
    </ul>
  );
}

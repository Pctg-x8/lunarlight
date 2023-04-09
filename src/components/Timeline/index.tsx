import { TimelineMode } from "@/models/localPreferences";
import { Status } from "@/models/status";
import StatusRow from "../StatusRow";
import styles from "./styles.module.scss";

export default function Timeline({
  statuses,
  mode = "normal",
}: {
  readonly statuses: Status[];
  readonly mode?: TimelineMode;
}) {
  return (
    <ul className={styles.staticTimeline}>
      {statuses.map((s, x) => (
        <li key={x}>
          <StatusRow status={s} mode={mode} />
        </li>
      ))}
    </ul>
  );
}

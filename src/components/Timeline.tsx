import { TimelineMode } from "@/models/localPreferences";
import { Status } from "@/models/status";
import { isDefined } from "@/utils";
import { css } from "@styled-system/css";
import StatusRow from "./StatusRow";

export default function Timeline({
  statuses,
  deletedIds,
  mode = "normal",
}: {
  readonly statuses: Status[];
  readonly deletedIds?: Immutable.Set<string>;
  readonly mode?: TimelineMode;
}) {
  const hasDeleted = (s: Status) => isDefined(deletedIds) && deletedIds.has(s.timelineId);

  return (
    <ul>
      {statuses.map((s, x) => (
        <li key={x} className={StaticTimeline} data-deleted={hasDeleted(s)}>
          <StatusRow status={s} mode={mode} disabled={hasDeleted(s)} />
        </li>
      ))}
    </ul>
  );
}

const StaticTimeline = css({
  borderBottom: "1px solid",
  borderBottomColor: "status.border",
  _deleted: {
    opacity: "0.5",
    textDecoration: "line-through",
  },
});

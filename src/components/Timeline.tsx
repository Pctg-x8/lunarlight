import { TimelineMode } from "@/models/localPreferences";
import { Status } from "@/models/status";
import { isDefined } from "@/utils";
import { styled } from "@linaria/react";
import cls from "classnames";
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
  return (
    <ul>
      {statuses.map((s, x) => (
        <StaticTimelineRow key={x} className={cls({ deleted: isDefined(deletedIds) && deletedIds.has(s.timelineId) })}>
          <StatusRow status={s} mode={mode} />
        </StaticTimelineRow>
      ))}
    </ul>
  );
}

const StaticTimelineRow = styled.li`
  border-bottom: 1px solid var(--theme-status-border);

  .deleted {
    opacity: 0.5;
    text-decoration: line-through;
  }
`;

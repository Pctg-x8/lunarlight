import { TimelineMode } from "@/models/localPreferences";
import { Status } from "@/models/status";
import { isDefined } from "@/utils";
import { styled } from "@linaria/react";
import cls from "classnames";
import { useRouter } from "next/router";
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
  const nav = useRouter();

  return (
    <ul>
      {statuses.map((s, x) => (
        <StaticTimelineRow key={x} className={cls({ deleted: hasDeleted(s) })}>
          <StatusRow status={s} mode={mode} disabled={hasDeleted(s)} onPreview={s => nav.push(s.previewPath)} />
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

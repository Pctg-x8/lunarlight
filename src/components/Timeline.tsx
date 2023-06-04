import { TimelineMode } from "@/models/localPreferences";
import { Status } from "@/models/status";
import { styled } from "@linaria/react";
import StatusRow from "./StatusRow";

export default function Timeline({
  statuses,
  mode = "normal",
}: {
  readonly statuses: Status[];
  readonly mode?: TimelineMode;
}) {
  return (
    <StaticTimeline>
      {statuses.map((s, x) => (
        <li key={x}>
          <StatusRow status={s} mode={mode} />
        </li>
      ))}
    </StaticTimeline>
  );
}

const StaticTimeline = styled.ul`
  & > li {
    border-bottom: 1px solid var(--theme-status-border);
  }
`;

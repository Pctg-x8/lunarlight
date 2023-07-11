import { TimelineMode } from "@/models/localPreferences";
import { Status } from "@/models/status";
import { isDefined } from "@/utils";
import { css } from "@styled-system/css";
import { useRouter } from "next/navigation";
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
        <li key={x} className={Row}>
          <StatusRow status={s} mode={mode} deleted={hasDeleted(s)} onPreview={s => nav.push(s.previewPath)} />
        </li>
      ))}
    </ul>
  );
}

const Row = css({
  borderBottom: "1px solid",
  borderBottomColor: "status.border",
});

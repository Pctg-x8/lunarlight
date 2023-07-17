import { TimelineMode } from "@/models/localPreferences";
import { Status } from "@/models/status";
import ExpertStatusRow from "./StatusRow/Expert";
import NormalStatusRow from "./StatusRow/Normal";

export default function StatusRow({
  status,
  mode,
  deleted = false,
  onPreview,
}: {
  readonly status: Status;
  readonly mode: TimelineMode;
  readonly deleted?: boolean;
  readonly onPreview: (status: Status) => void;
}) {
  switch (mode) {
    case "normal":
      return <NormalStatusRow status={status} deleted={deleted} onPreview={onPreview} />;
    case "expert":
      return <ExpertStatusRow status={status} deleted={deleted} onPreview={onPreview} />;
  }
}

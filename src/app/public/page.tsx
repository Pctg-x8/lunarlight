import PublicStreamingTimeline from "@/components/PublicStreamingTimeline";
import StreamingTimelineOuterStyle from "@/components/StreamingTimelineOuterStyle";

export default async function PublicTimelinePage() {
  return (
    <StreamingTimelineOuterStyle>
      <PublicStreamingTimeline />
    </StreamingTimelineOuterStyle>
  );
}

import dynamic from "next/dynamic";

const StreamingTimeline = dynamic(() => import("@/components/PublicStreamingTimeline"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
export default async function PublicTimelinePage() {
  return <StreamingTimeline />;
}

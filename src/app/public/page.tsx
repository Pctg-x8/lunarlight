import ClientPreferencesProvider from "@/components/ClientPreferencesProvider";
import PublicStreamingTimeline from "@/components/PublicStreamingTimeline";

export default async function PublicTimelinePage() {
  return (
    <ClientPreferencesProvider>
      <PublicStreamingTimeline />
    </ClientPreferencesProvider>
  );
}

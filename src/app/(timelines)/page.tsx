import { getAuthorizedAccountSSR } from "@/models/auth";
import dynamic from "next/dynamic";

const StreamingTimeline = dynamic(() => import("@/components/HomeStreamingTimeline"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
export default async function Home() {
  const hasLoggedIn = (await getAuthorizedAccountSSR()) !== null;

  if (!hasLoggedIn) return <p></p>;

  return <StreamingTimeline />;
}

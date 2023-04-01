import HomeStreamingTimeline from "@/components/HomeStreamingTimeline";
import { getAuthorizedAccountSSR } from "@/models/auth";

export default async function Home() {
  const hasLoggedIn = (await getAuthorizedAccountSSR()) !== null;

  if (!hasLoggedIn) return <p></p>;

  return <HomeStreamingTimeline />;
}

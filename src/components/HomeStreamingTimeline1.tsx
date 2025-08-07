"use client";

import dynamic from "next/dynamic";

const Content = dynamic(() => import("@/components/HomeStreamingTimeline"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
export default function HomeStreamingTimeline1() {
  return <Content />;
}

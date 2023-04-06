"use client";

import { HomeTimelineRequestParams } from "@/models/api/mastodon/timeline";
import LocalPreferences from "@/models/localPreferences";
import { Status } from "@/models/status";
import { rpcClient } from "@/rpc/client";
import { useEffect, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import Timeline from "./Timeline";

export default function HomeStreamingTimeline() {
  const mode = useMemo(() => LocalPreferences.TIMELINE_MODE.load(), []);

  const { data, isLoading, setSize } = useSWRInfinite(
    (_, prevPageData: Status[] | null): HomeTimelineRequestParams | null => {
      if (!prevPageData) return { limit: 50 };
      if (prevPageData.length === 0) return null;
      return { limit: 50, max_id: prevPageData[prevPageData.length - 1].timelineId };
    },
    (req) => rpcClient.homeTimeline.query(req).then((xs) => xs.map(Status.fromApiData)),
    { revalidateFirstPage: false, revalidateAll: false }
  );
  const statuses = useMemo(() => data?.flat() ?? [], [data]);

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;

    const io = new IntersectionObserver(
      (e) => {
        if (e.length < 1 || !e[0].isIntersecting) return;

        setSize((x) => x + 1);
      },
      { threshold: 1.0 }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [isLoading, setSize]);

  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      <Timeline statuses={statuses} mode={mode} />
      <div ref={sentinelRef} />
    </>
  );
}

"use client";

import { Status } from "@/models/api/mastodon/status";
import { rpcClient } from "@/rpc/client";
import { useEffect, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import Timeline from "../Timeline";

export default function AccountTimeline({ accountId }: { readonly accountId: string }) {
  const { data, isLoading, setSize } = useSWRInfinite(
    (pageId, prevPageData): { readonly max_id?: string; readonly limit?: number } | null => {
      console.log(pageId, prevPageData);
      if (!prevPageData) return { limit: 20 };
      if (prevPageData.length === 0) return null;
      return { limit: 20, max_id: prevPageData[prevPageData.length - 1].id };
    },
    (req) => rpcClient.account.statuses.query({ accountId, ...req })
  );
  const statuses: Status[] = useMemo(() => data?.flat() ?? [], [data]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const io = new IntersectionObserver(
      (_) => {
        setSize((x) => x + 1);
      },
      { threshold: 1.0 }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [isLoading, setSize]);

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <>
      <Timeline statuses={statuses} />
      <div ref={sentinelRef} />
    </>
  );
}

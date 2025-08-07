"use client";

import { Status } from "@/models/status";
import { rpcClient } from "@/rpc/client";
import { useEffect, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import NormalTimelineView from "./Timeline/Normal";

export default function AccountTimeline({ accountId }: { readonly accountId: string }) {
  const { data, setSize } = useSWRInfinite(
    (
      _,
      prevPageData: Status[] | null
    ): { readonly max_id?: string; readonly limit?: number; readonly accountId: string } | null => {
      if (!prevPageData) return { limit: 20, accountId };
      if (prevPageData.length === 0) return null;
      return { limit: 20, max_id: prevPageData[prevPageData.length - 1].timelineId, accountId };
    },
    req => rpcClient.account.statuses.query(req),
    { revalidateFirstPage: false, revalidateAll: false, suspense: true }
  );
  const statuses: Status[] = useMemo(() => data?.flat() ?? [], [data]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      e => {
        if (e.length < 1 || !e[0].isIntersecting) return;

        setSize(x => x + 1);
      },
      { threshold: 1.0 }
    );
    io.observe(sentinelRef.current!);
    return () => io.disconnect();
  }, [setSize]);

  return (
    <>
      <NormalTimelineView statuses={statuses} />
      <div ref={sentinelRef} />
    </>
  );
}

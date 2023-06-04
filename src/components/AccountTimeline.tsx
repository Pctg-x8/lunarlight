"use client";

import { Status } from "@/models/status";
import { rpcClient } from "@/rpc/client";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import Timeline from "./Timeline";

function Component({ accountId }: { readonly accountId: string }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Content accountId={accountId} key={accountId} />
    </Suspense>
  );
}

function Content({ accountId }: { readonly accountId: string }) {
  const { data, setSize } = useSWRInfinite(
    (_, prevPageData: Status[] | null): { readonly max_id?: string; readonly limit?: number } | null => {
      if (!prevPageData) return { limit: 20 };
      if (prevPageData.length === 0) return null;
      return { limit: 20, max_id: prevPageData[prevPageData.length - 1].timelineId };
    },
    req => rpcClient.account.statuses.query({ accountId, ...req }).then(xs => xs.map(Status.fromApiData)),
    { revalidateFirstPage: false, revalidateAll: false, suspense: true }
  );
  const statuses: Status[] = useMemo(() => data?.flat() ?? [], [data]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const io = new IntersectionObserver(
      e => {
        if (e.length < 1 || !e[0].isIntersecting) return;

        setSize(x => x + 1);
      },
      { threshold: 1.0 }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [setSize]);

  return (
    <>
      <Timeline statuses={statuses} />
      <div ref={sentinelRef} />
    </>
  );
}

const AccountTimeline = dynamic(() => Promise.resolve(Component), { ssr: false });
export default AccountTimeline;

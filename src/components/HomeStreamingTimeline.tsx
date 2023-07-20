"use client";

import { HomeTimelineRequestParams } from "@/models/api/mastodon/timeline";
import { Status } from "@/models/status";
import { DeleteEvent, Event, UpdateEvent, useStreamEvents } from "@/models/streaming";
import { rpcClient } from "@/rpc/client";
import Immutable from "immutable";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ClientPreferencesContext } from "./ClientPreferencesProvider";
import Timeline from "./Timeline";

export default function HomeStreamingTimeline() {
  const { timelineMode: mode } = useContext(ClientPreferencesContext);

  const { data, setSize, mutate } = useSWRInfinite(
    (_, prevPageData: Status[] | null): (HomeTimelineRequestParams & { readonly timeline: "home" }) | null => {
      if (!prevPageData) return { timeline: "home", limit: 50 };
      if (prevPageData.length === 0) return null;
      return { timeline: "home", limit: 50, max_id: prevPageData[prevPageData.length - 1].timelineId };
    },
    req => rpcClient.homeTimeline.query(req),
    { suspense: true, revalidateFirstPage: false, revalidateAll: false, revalidateOnMount: true }
  );
  const statuses = useMemo(() => data?.flat() ?? [], [data]);
  const [deletedIds, setDeletedIds] = useState(() => Immutable.Set<string>());

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

  const handleEvents = useCallback(
    (e: Event) => {
      if (e instanceof UpdateEvent) {
        mutate(xs => (!xs ? [[e.status]] : [[e.status], ...xs]));
      } else if (e instanceof DeleteEvent) {
        setDeletedIds(xs => xs.add(e.targetId));
      }
    },
    [mutate, setDeletedIds]
  );
  useStreamEvents("user", handleEvents);

  return (
    <>
      <Timeline statuses={statuses} deletedIds={deletedIds} mode={mode} />
      <div ref={sentinelRef} />
    </>
  );
}

"use client";

import { PublicTimelineRequestParams } from "@/models/api/mastodon/timeline";
import { Status } from "@/models/status";
import { DeleteEvent, Event, UpdateEvent, useStreamEvents } from "@/models/streaming";
import { rpcClient } from "@/rpc/client";
import Immutable from "immutable";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ClientPreferencesContext } from "./ClientPreferencesProvider";
import NormalPostView from "./PostView/Normal";
import { ExpertTimelineContainer, ExpertTimelineRow } from "./Timeline/Expert";
import NormalTimelineRow from "./Timeline/Normal";

export default function PublicStreamingTimeline() {
  const { timelineMode: mode } = useContext(ClientPreferencesContext);

  const { data, setSize, mutate } = useSWRInfinite(
    (_, prevPageData: Status[] | null): (PublicTimelineRequestParams & { readonly timeline: "public" }) | null => {
      if (!prevPageData) return { timeline: "public", limit: 50 };
      if (prevPageData.length === 0) return null;
      return { timeline: "public", limit: 50, max_id: prevPageData[prevPageData.length - 1].timelineId };
    },
    req => rpcClient.publicTimeline.query(req),
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
  useStreamEvents("public", handleEvents);

  return (
    <>
      {mode === "normal" ? (
        <ul>
          <NormalPostView />
          {statuses.map(s => (
            <NormalTimelineRow key={s.timelineId} status={s} deleted={deletedIds.has(s.timelineId)} />
          ))}
        </ul>
      ) : (
        <ExpertTimelineContainer>
          {statuses.map(s => (
            <ExpertTimelineRow key={s.timelineId} status={s} deleted={deletedIds.has(s.timelineId)} />
          ))}
        </ExpertTimelineContainer>
      )}
      <div ref={sentinelRef} />
    </>
  );
}

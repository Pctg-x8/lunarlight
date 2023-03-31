"use client";

import { rpcClient } from "@/rpc/client";
import useSWRInfinite from "swr/infinite";
import Timeline from "../Timeline";

export default function AccountTimeline({ accountId }: { readonly accountId: string }) {
  const { data, isLoading } = useSWRInfinite(
    (_, prevPageData): { readonly max_id?: string; readonly limit?: number } => {
      return !prevPageData ? { limit: 20 } : { limit: 20, max_id: prevPageData[prevPageData.length - 1].id };
    },
    (req) => rpcClient.account.statuses.query({ accountId, ...req })
  );

  return isLoading ? <p>Loading...</p> : <Timeline statuses={data?.flat() ?? []} />;
}

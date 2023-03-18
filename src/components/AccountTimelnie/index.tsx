"use client";

import ProdInstance from "@/models/api";
import { getStatusesForAccount } from "@/models/api/mastodon/status";
import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import Timeline from "../Timeline";

export default function AccountTimeline({ accountId }: { readonly accountId: string }) {
  const server = useMemo(() => {
    const instance = new ProdInstance();
    console.log("cookie", document.cookie);
    return instance;
  }, []);

  const { data, isLoading } = useSWRInfinite(
    (_, prevPageData) => {
      return !prevPageData ? { limit: 20 } : { limit: 20, max_id: prevPageData[prevPageData.length - 1].id };
    },
    (req) => getStatusesForAccount(accountId).send(req, server)
  );

  return isLoading ? <p>Loading...</p> : <Timeline statuses={data?.flat() ?? []} />;
}

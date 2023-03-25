"use client";

import ProdInstance, { SearchParamsRequestBody } from "@/models/api";
import { AccountStatusRequestParams, getStatusesForAccount } from "@/models/api/mastodon/status";
import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import Timeline from "../Timeline";

export default function AccountTimeline({ accountId }: { readonly accountId: string }) {
  const server = useMemo(() => new ProdInstance(), []);

  const { data, isLoading } = useSWRInfinite(
    (_, prevPageData): AccountStatusRequestParams => {
      return !prevPageData ? { limit: 20 } : { limit: 20, max_id: prevPageData[prevPageData.length - 1].id };
    },
    (req) => getStatusesForAccount(accountId).send(new SearchParamsRequestBody(req), server)
  );

  return isLoading ? <p>Loading...</p> : <Timeline statuses={data?.flat() ?? []} />;
}

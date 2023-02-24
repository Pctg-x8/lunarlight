"use client";

import ProdInstance from "@/models/api";
import { getStatusesForAccount } from "@/models/api/mastodon/status";
import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import StatusRow from "../StatusRow";
import styles from "./styles.module.scss";

export default function StaticTimeline({ accountId }: { readonly accountId: string }) {
  const server = useMemo(() => new ProdInstance(), []);

  const { data } = useSWRInfinite(
    (_, prevPageData) => {
      return !prevPageData ? { limit: 20 } : { limit: 20, max_id: prevPageData[prevPageData.length - 1].id };
    },
    (req) => getStatusesForAccount(accountId).send(req, server)
  );

  return (
    <ul className={styles.staticTimeline}>
      {data?.flat().map((s, x) => (
        <li key={x}>
          <StatusRow status={s} />
        </li>
      ))}
    </ul>
  );
}

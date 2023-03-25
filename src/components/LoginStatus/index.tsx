"use client";

import { rpcClient } from "@/rpc/client";
import useSWR from "swr";

export default function LoginStatus() {
  const { data: account } = useSWR("authorizedAccount", () => rpcClient.authorizedAccount.query(), {
    suspense: true,
    fallback: { authorizedAccount: null },
  });
  const doLogin = () => {};

  return !account ? <button onClick={doLogin}>ログイン</button> : <img src={account.avatar} />;
}

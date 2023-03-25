"use client";

import { rpcClient } from "@/rpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function LoginStatus() {
  const { data: account, isLoading } = useSWR("authorizedAccount", () => rpcClient.authorizedAccount.query());

  const nav = useRouter();
  const [loginPending, setLoginPending] = useState(false);
  const doLogin = () => {
    setLoginPending(true);
    rpcClient.loginUrl
      .query()
      .then((l) => nav.push(l))
      .finally(() => setLoginPending(false));
  };

  if (isLoading) return <></>;

  return !account ? (
    <button onClick={doLogin} disabled={loginPending}>
      ログイン
    </button>
  ) : (
    <img src={account.avatar} />
  );
}

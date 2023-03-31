"use client";

import { rpcClient } from "@/rpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import styles from "./styles.module.scss";

export default function LoginStatus() {
  const { data: account, isLoading } = useSWR("authorizedAccount", () => rpcClient.authorizedAccount.query());

  const nav = useRouter();
  const [loginPending, setLoginPending] = useState(false);
  const doLogin = async () => {
    setLoginPending(true);
    try {
      nav.push(await rpcClient.loginUrl.query());
    } finally {
      setLoginPending(false);
    }
  };

  if (isLoading) return <></>;

  return !account ? (
    <button onClick={doLogin} disabled={loginPending} className={styles.button}>
      ログイン
    </button>
  ) : (
    <Link href={`/@${account.acct}`} title={`@${account.acct}`} className={`no-default ${styles.account}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={account.avatar} alt={account.acct} />
    </Link>
  );
}

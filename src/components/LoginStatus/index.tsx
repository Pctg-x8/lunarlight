"use server";

import { CredentialAccount } from "@/models/api/mastodon/account";

export default function LoginStatus({ account }: { readonly account?: CredentialAccount }) {
  const doLogin = () => {};

  return !account ? <button onClick={doLogin}>ログイン</button> : <img src={account.avatar} />;
}

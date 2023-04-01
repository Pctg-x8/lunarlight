import AccountTimeline from "@/components/AccountTimelnie";
import UserHeader from "@/components/UserHeader";
import { Account } from "@/models/account";
import { DefaultInstance, HTTPError, SearchParamsRequestBody } from "@/models/api";
import { lookup } from "@/models/api/mastodon/account";
import { stripPrefix } from "@/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function getData(acct: string): Promise<{ readonly account: Account; readonly fullAcct: string }> {
  try {
    const account = new Account(await lookup.send(new SearchParamsRequestBody({ acct }), DefaultInstance));

    return { account, fullAcct: (await account.fullAcct(DefaultInstance)).toString() };
  } catch (e) {
    if (e instanceof HTTPError.NotFoundError) {
      notFound();
    } else {
      throw e;
    }
  }
}

export async function generateMetadata({ params }: { readonly params: { readonly acct: string } }): Promise<Metadata> {
  const { account, fullAcct } = await getData(stripPrefix(decodeURIComponent(params.acct), "@"));

  return { title: `${account.displayName}(@${fullAcct})` };
}

export default async function UserPage({
  params,
}: {
  readonly params: { readonly acct: string };
}): Promise<JSX.Element> {
  // strip prefixing @(%40)
  const { account, fullAcct } = await getData(stripPrefix(decodeURIComponent(params.acct), "@"));

  return (
    <>
      <UserHeader account={account} fullAcct={fullAcct} />
      <AccountTimeline accountId={account.id} />
    </>
  );
}

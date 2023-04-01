import AccountTimeline from "@/components/AccountTimelnie";
import UserHeader from "@/components/UserHeader";
import { DefaultInstance, HTTPError, SearchParamsRequestBody } from "@/models/api";
import { lookup } from "@/models/api/mastodon/account";
import Webfinger from "@/models/webfinger";
import { stripPrefix } from "@/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function getData(acct: string) {
  try {
    const account = await lookup.send(new SearchParamsRequestBody({ acct }), DefaultInstance);
    const fullAcct = await Webfinger.Address.decompose(account.acct).resolveDomainPart(DefaultInstance);

    return { account, fullAcct: fullAcct.toString() };
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

  return { title: `${account.display_name}(@${fullAcct})` };
}

export default async function UserPage({ params }: { readonly params: { readonly acct: string } }) {
  // strip prefixing @(%40)
  const { account, fullAcct } = await getData(stripPrefix(decodeURIComponent(params.acct), "@"));

  return (
    <>
      <UserHeader account={account} fullAcct={fullAcct} />
      <AccountTimeline accountId={account.id} />
    </>
  );
}

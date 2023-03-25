import AccountTimeline from "@/components/AccountTimelnie";
import UserHeader from "@/components/UserHeader";
import ProdInstance, { HTTPError, SearchParamsRequestBody } from "@/models/api";
import { lookup } from "@/models/api/mastodon/account";
import { WebFingerAccount } from "@/models/webfinger";
import { cookie } from "@/utils/cookie";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function getData(acct: string) {
  try {
    const token = cookie.token();
    const instance = new ProdInstance();

    const account = await lookup.send(
      new SearchParamsRequestBody({ acct: decodeURIComponent(acct) }),
      token ? instance.withAuthorizationToken(token) : instance
    );
    const fullAcct = await WebFingerAccount.decompose(account.acct).resolveDomainPart(instance);

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
  const { account, fullAcct } = await getData(params.acct.slice(3));

  return { title: `${account.display_name}(@${fullAcct})` };
}

export default async function UserPage({ params }: { readonly params: { readonly acct: string } }) {
  // strip prefixing @(%40)
  const { account, fullAcct } = await getData(params.acct.slice(3));

  return (
    <>
      <UserHeader account={account} fullAcct={fullAcct} />
      <AccountTimeline accountId={account.id} />
    </>
  );
}

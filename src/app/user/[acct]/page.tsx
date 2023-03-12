import StaticTimeline from "@/components/StaticTimeline";
import UserHeader from "@/components/UserHeader";
import ProdInstance, { NotFoundAPIResponseError } from "@/models/api";
import { lookup } from "@/models/api/mastodon/account";
import { resolveFullWebFingerString } from "@/models/webfinger";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getData(acct: string) {
  try {
    const token = cookies().get("_lla")?.value;
    const instance = new ProdInstance();

    const account = await lookup.send(
      { acct: decodeURIComponent(acct) },
      token ? instance.withAuthorizationToken(token) : instance
    );
    const fullAcct = await resolveFullWebFingerString(account.acct, instance);

    return { account, fullAcct };
  } catch (e) {
    if (e instanceof NotFoundAPIResponseError) {
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
      <StaticTimeline accountId={account.id} />
    </>
  );
}

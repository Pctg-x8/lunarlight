import UserHeader from "@/components/UserHeader";
import { Account } from "@/models/account";
import { DefaultInstance, HTTPError } from "@/models/api";
import { stripPrefix } from "@/utils";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export type PageParams = {
  readonly acct: string;
};

async function getData(acct: string): Promise<{ readonly account: Account; readonly fullAcct: string }> {
  try {
    const account = await Account.lookup(acct);

    return { account, fullAcct: (await account.fullAcct(DefaultInstance)).toString() };
  } catch (e) {
    if (e instanceof HTTPError.NotFoundError) {
      notFound();
    } else {
      throw e;
    }
  }
}

export async function generateMetadata({ params }: { readonly params: PageParams }): Promise<Metadata> {
  const { account, fullAcct } = await getData(stripPrefix(decodeURIComponent(params.acct), "@"));

  return { title: `${account.displayName}(@${fullAcct})` };
}

const AccountTimeline = dynamic(() => import("@/components/AccountTimeline"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default async function UserPage({ params }: { readonly params: PageParams }): Promise<JSX.Element> {
  // strip prefixing @(%40)
  const { account, fullAcct } = await getData(stripPrefix(decodeURIComponent(params.acct), "@"));

  return (
    <>
      <UserHeader account={account} fullAcct={fullAcct} />
      <AccountTimeline accountId={account.id} />
    </>
  );
}

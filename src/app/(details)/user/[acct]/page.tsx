import AccountTimeline from "@/components/AccountTimeline";
import UserHeader from "@/components/UserHeader";
import { Account } from "@/models/account";
import { DefaultInstance, HTTPError } from "@/models/api";
import EmojiResolver from "@/models/emoji";
import { stripPrefix } from "@/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export type PageParams = {
  readonly acct: string;
};

async function getData(acct: string): Promise<{ readonly account: Account; readonly fullAcct: string }> {
  try {
    const account = await (await Account.lookup(acct)).resolveEmojis(new EmojiResolver());

    return { account, fullAcct: (await account.fullAcct(DefaultInstance)).toString() };
  } catch (e) {
    if (e instanceof HTTPError.NotFoundError) {
      notFound();
    } else {
      throw e;
    }
  }
}

export async function generateMetadata({ params }: { readonly params: Promise<PageParams> }): Promise<Metadata> {
  const { acct } = await params;
  const { account, fullAcct } = await getData(stripPrefix(decodeURIComponent(acct), "@"));

  return { title: `${account.displayName}(@${fullAcct})` };
}

export default async function UserPage({ params }: { readonly params: Promise<PageParams> }): Promise<JSX.Element> {
  const { acct } = await params;
  // strip prefixing @(%40)
  const { account, fullAcct } = await getData(stripPrefix(decodeURIComponent(acct), "@"));

  return (
    <>
      <UserHeader account={account} fullAcct={fullAcct} />
      <AccountTimeline accountId={account.id} />
    </>
  );
}

import AccountTimeline from "@/components/AccountTimeline";
import UserHeader from "@/components/UserHeader";
import { Account } from "@/models/account";
import { DefaultInstance, HTTPError } from "@/models/api";
import EmojiResolver from "@/models/emoji";
import { stripPrefix } from "@/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
      <Suspense fallback={<p>Loading...</p>}>
        <AccountTimeline accountId={account.id} />
      </Suspense>
    </>
  );
}

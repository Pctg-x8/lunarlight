import UserHeader from "@/components/UserHeader";
import ProdInstance, { NotFoundAPIResponseError } from "@/models/api";
import { lookup } from "@/models/api/mastodon/account";
import { resolveFullWebFingerString } from "@/models/webfinger";
import { notFound } from "next/navigation";

export async function getData(acct: string) {
  try {
    const instance = new ProdInstance();

    const account = await lookup(acct).send(instance);
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

export default async function UserPage({ params }: { readonly params: { readonly acct: string } }) {
  // strip prefixing @(%40)
  const { account, fullAcct } = await getData(params.acct.slice(3));

  return (
    <>
      <UserHeader account={account} fullAcct={fullAcct} />
    </>
  );
}

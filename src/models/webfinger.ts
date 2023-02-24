import { ServerInstance } from "./api";
import { getInstanceData } from "./api/mastodon/instance";

export type WebFingerAccount = {
  readonly name: string;
  readonly domain?: string;
};

export function stripPrefixAtmark(acct: string): string {
  return acct.startsWith("@") ? acct.slice(1) : acct;
}

export function decomposeWebFingerAccount(acct: string): WebFingerAccount {
  const acctFormed = acct.startsWith("@") ? acct.slice(1) : acct;
  const atPosition = acctFormed.indexOf("@");

  if (atPosition < 0) {
    // no domain(maybe local account)
    return { name: acctFormed };
  } else {
    return { name: acctFormed.slice(0, atPosition), domain: acctFormed.slice(atPosition + 1) };
  }
}
export function buildWebFingerAccountString(a: WebFingerAccount): string {
  return a.domain ? `${a.name}@${a.domain}` : a.name;
}
export async function resolveWebFingerDomainPart(
  target: WebFingerAccount,
  instance: ServerInstance
): Promise<WebFingerAccount> {
  return { ...target, domain: target.domain ?? (await getInstanceData.send({}, instance).then((x) => x.domain)) };
}

export async function resolveFullWebFingerString(acct: string, instance: ServerInstance): Promise<string> {
  return buildWebFingerAccountString(await resolveWebFingerDomainPart(decomposeWebFingerAccount(acct), instance));
}

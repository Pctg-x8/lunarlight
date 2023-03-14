import { RemoteInstance } from "./api";
import { getInstanceData } from "./api/mastodon/instance";

export abstract class WebFingerAccount {
  static decompose(acct: string): WebFingerAccount {
    const acctFormed = acct.startsWith("@") ? acct.slice(1) : acct;
    const atPosition = acctFormed.indexOf("@");

    // no domain(maybe local account)
    if (atPosition < 0) return new LocalWebFingerAccount(acctFormed);

    return new RemoteWebFingerAccount(acctFormed.slice(0, atPosition), acctFormed.slice(atPosition + 1));
  }

  abstract toString(): string;
  abstract resolveDomainPart(instance: RemoteInstance): Promise<RemoteWebFingerAccount>;
}

export class LocalWebFingerAccount extends WebFingerAccount {
  constructor(readonly name: string) {
    super();
  }

  override toString(): string {
    return this.name;
  }

  override async resolveDomainPart(instance: RemoteInstance): Promise<RemoteWebFingerAccount> {
    const { domain } = await getInstanceData.send({}, instance);
    return new RemoteWebFingerAccount(this.name, domain);
  }
}

export class RemoteWebFingerAccount extends WebFingerAccount {
  constructor(readonly name: string, readonly domain: string) {
    super();
  }

  override toString(): string {
    return `${this.name}@${this.domain}`;
  }

  override async resolveDomainPart(_instance: RemoteInstance): Promise<RemoteWebFingerAccount> {
    return this;
  }
}

export function stripPrefixAtmark(acct: string): string {
  return acct.startsWith("@") ? acct.slice(1) : acct;
}

import { stripPrefix } from "@/utils";
import { EmptyRequestBody, RemoteInstance } from "./api";
import { getInstanceData } from "./api/mastodon/instance";

namespace Webfinger {
  export abstract class Address {
    static decompose(acct: string): Address {
      const acctFormed = stripPrefix(acct, "@");
      const atPosition = acctFormed.indexOf("@");

      // no domain(maybe local account)
      if (atPosition < 0) return new LocalAddress(acctFormed);

      return new RemoteAddress(acctFormed.slice(0, atPosition), acctFormed.slice(atPosition + 1));
    }

    abstract toString(): string;
    abstract resolveDomainPart(instance: RemoteInstance): Promise<RemoteAddress>;
  }

  export class LocalAddress extends Address {
    constructor(readonly name: string) {
      super();
    }

    override toString(): string {
      return this.name;
    }

    override async resolveDomainPart(instance: RemoteInstance): Promise<RemoteAddress> {
      const { domain } = await getInstanceData.send(EmptyRequestBody.instance, instance);
      return new RemoteAddress(this.name, domain);
    }
  }

  export class RemoteAddress extends Address {
    constructor(readonly name: string, readonly domain: string) {
      super();
    }

    override toString(): string {
      return `${this.name}@${this.domain}`;
    }

    override async resolveDomainPart(_instance: RemoteInstance): Promise<RemoteAddress> {
      return this;
    }
  }
}

export default Webfinger;

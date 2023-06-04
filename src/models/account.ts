import { DefaultInstance, RemoteInstance, SearchParamsRequestBody } from "./api";
import { AccountField, Account as ApiAccountData, lookup } from "./api/mastodon/account";
import { CustomInstanceOption } from "./requestOptions";
import Webfinger from "./webfinger";

export type AccountCounters = {
  readonly posts: number;
  readonly followers: number;
  readonly followings: number;
};
export class Account {
  static async lookup(acct: string, options: Partial<CustomInstanceOption> = {}) {
    return lookup
      .send(new SearchParamsRequestBody({ acct }), options.instance ?? DefaultInstance)
      .then(x => new Account(x));
  }

  constructor(private readonly values: ApiAccountData) {}

  get pagePath(): string {
    return `/@${this.values.acct}`;
  }

  get id(): string {
    return this.values.id;
  }

  get displayName(): string {
    return this.values.display_name;
  }

  get avatarUrl(): string {
    return this.values.avatar;
  }

  get headerUrl(): string {
    return this.values.header;
  }

  get note(): string {
    return this.values.note;
  }

  get counters(): AccountCounters {
    return {
      posts: this.values.statuses_count,
      followers: this.values.followers_count,
      followings: this.values.following_count,
    };
  }

  get fields(): AccountField[] {
    return this.values.fields;
  }

  get acct(): Webfinger.Address {
    return Webfinger.Address.decompose(this.values.acct);
  }

  private _cachedFullAcct: Webfinger.RemoteAddress | null = null;
  async fullAcct(instance: RemoteInstance): Promise<Webfinger.RemoteAddress> {
    return (this._cachedFullAcct ??= await this.acct.resolveDomainPart(instance));
  }
}

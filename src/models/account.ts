import { RemoteInstance } from "./api";
import { AccountField, Account as ApiAccountData } from "./api/mastodon/account";
import Webfinger from "./webfinger";

export type AccountCounters = {
  readonly posts: number;
  readonly followers: number;
  readonly followings: number;
};
export class Account {
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

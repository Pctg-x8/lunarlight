import { superjsonSerializableClass } from "@/utils/decorators/superjson";
import Immutable from "immutable";
import { DefaultInstance, RemoteInstance, SearchParamsRequestBody } from "./api";
import { AccountField, Account as ApiAccountData, isRemoteAccount, lookup } from "./api/mastodon/account";
import EmojiResolver, { EmojiPattern, rewriteHtmlTextEmojis } from "./emoji";
import { CustomInstanceOption } from "./requestOptions";
import Webfinger from "./webfinger";

export async function resolveAccountEmojis(
  account: ApiAccountData,
  resolver: EmojiResolver,
  instance: RemoteInstance
): Promise<Immutable.Map<string, string>> {
  const emojis = Immutable.Set.of(...Array.from(account.display_name.matchAll(EmojiPattern), c => c[1]));
  const { domain: preferredDomain } = await Webfinger.Address.decompose(account.acct).resolveDomainPart(instance);

  return await resolver.resolveMultiple(emojis.toArray(), preferredDomain);
}

export function rewriteAccountContentEmojis(
  source: ApiAccountData,
  emojiToUrlMap: Immutable.Map<string, string>
): ApiAccountData {
  return { ...source, note: rewriteHtmlTextEmojis(source.note, emojiToUrlMap) };
}

export type AccountCounters = {
  readonly posts: number;
  readonly followers: number;
  readonly followings: number;
};

@superjsonSerializableClass({ identifier: "Lunarlight.Models.Account" })
export class Account {
  static async lookup(acct: string, options: Partial<CustomInstanceOption> = {}) {
    return lookup
      .send(new SearchParamsRequestBody({ acct }), options.instance ?? DefaultInstance)
      .then(Account.fromApiData);
  }

  static fromApiData(values: ApiAccountData) {
    return new Account(values);
  }

  constructor(
    private readonly values: ApiAccountData,
    readonly emojiToUrlMap: Immutable.Map<string, string> = Immutable.Map()
  ) {}

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

  private _cachedRewritedNote: string | null = null;
  get note(): string {
    return (this._cachedRewritedNote ??= rewriteHtmlTextEmojis(this.values.note, this.emojiToUrlMap));
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

  get isRemote(): boolean {
    return isRemoteAccount(this.values);
  }

  async resolveEmojis(resolver: EmojiResolver, instance: RemoteInstance = DefaultInstance): Promise<Account> {
    return new Account(this.values, await resolveAccountEmojis(this.values, resolver, instance));
  }
}

import { stripTags } from "@/utils";
import { superjsonSerializableClass } from "@/utils/decorators/superjson";
import Immutable from "immutable";
import { Account, resolveAccountEmojis } from "./account";
import { DefaultInstance, EmptyRequestBody, RemoteInstance } from "./api";
import { Status as ApiStatusData, Application, getStatus } from "./api/mastodon/status";
import { EmojiPattern } from "./emoji";
import EmojiResolver from "./emoji_resolver";
import { CustomInstanceOption } from "./requestOptions";
import Webfinger from "./webfinger";

export type Counters = {
  readonly replied: number;
  readonly favorited: number;
  readonly reblogged: number;
};

export async function resolveStatusEmojis(
  status: ApiStatusData,
  resolver: EmojiResolver,
  instance: RemoteInstance
): Promise<Immutable.Map<string, string>> {
  const emojis = Immutable.Set.of(...Array.from(status.content.matchAll(EmojiPattern), c => c[1]));
  const { domain: preferredDomain } = await Webfinger.Address.decompose(status.account.acct).resolveDomainPart(
    instance
  );

  return await resolver.resolveMultiple(emojis.toArray(), preferredDomain);
}

export function rewriteStatusContentEmojis(
  orgStatus: ApiStatusData,
  emojiToUrlMap: Immutable.Map<string, string>
): ApiStatusData {
  const newContent = emojiToUrlMap.reduce(
    (c, u, e) => c.replaceAll(`:${e}:`, `<img src="${u}" alt=":${e}:" title=":${e}:">`),
    orgStatus.content
  );

  return { ...orgStatus, content: newContent };
}

export abstract class Status {
  static fromApiData(data: ApiStatusData): Status {
    if (data.reblog) {
      return new RebloggedStatus(data.reblog, new Account(data.account), data.id);
    }

    return new NormalStatus(data);
  }

  static async get(id: string, options: Partial<CustomInstanceOption> = {}) {
    return getStatus(id)
      .send(EmptyRequestBody.instance, options.instance ?? DefaultInstance)
      .then(Status.fromApiData);
  }

  declare abstract readonly previewPath: string;
  declare abstract readonly account: Account;
  declare abstract readonly timelineId: string;
  declare abstract readonly content: string;
  declare abstract readonly spoiler: string;
  declare abstract readonly application: Application | undefined;
  declare abstract readonly created_at: string;
  declare abstract readonly counters: Counters;
  abstract resolveEmojis(resolver: EmojiResolver, instance?: RemoteInstance): Promise<this>;
  abstract withResolvedEmojiToUrlMap(map: Immutable.Map<string, string>): this;
}

@superjsonSerializableClass({ identifier: "Lunarlight.Models.NormalStatus" })
export class NormalStatus extends Status {
  constructor(
    readonly values: ApiStatusData,
    private readonly emojiToUrlMap: Immutable.Map<string, string> = Immutable.Map()
  ) {
    super();
  }

  get previewPath() {
    return `/@${this.account.acct}/${this.timelineId}`;
  }

  private _account: Account | null = null;
  get account() {
    return (this._account ??= new Account(this.values.account, this.emojiToUrlMap));
  }

  get timelineId() {
    return this.values.id;
  }

  get content() {
    return this.values.content;
  }

  get spoiler() {
    return this.values.spoiler_text || this.values.text || stripTags(this.values.content);
  }

  get application() {
    return this.values.application;
  }

  get created_at() {
    return this.values.created_at;
  }

  get counters(): Counters {
    return {
      replied: this.values.replies_count ?? 0,
      favorited: this.values.favourites_count ?? 0,
      reblogged: this.values.reblogs_count ?? 0,
    };
  }

  async resolveEmojis(resolver: EmojiResolver, instance: RemoteInstance = DefaultInstance): Promise<this> {
    const emojiToUrlMap = await Promise.all([
      resolveStatusEmojis(this.values, resolver, instance),
      resolveAccountEmojis(this.values.account, resolver, instance),
    ]).then(xs => xs.reduce((a, b) => a.concat(b)));

    // @ts-ignore
    return new NormalStatus(rewriteStatusContentEmojis(this.values, emojiToUrlMap), emojiToUrlMap);
  }

  override withResolvedEmojiToUrlMap(map: Immutable.Map<string, string>): this {
    // @ts-ignore
    return new NormalStatus(this.values, map);
  }
}

@superjsonSerializableClass({ identifier: "Lunarlight.Models.RebloggedStatus" })
export class RebloggedStatus extends Status {
  constructor(
    readonly values: ApiStatusData,
    readonly rebloggedBy: Account,
    readonly rebloggedId: string,
    private readonly emojiToUrlMap: Immutable.Map<string, string> = Immutable.Map()
  ) {
    super();
  }

  get previewPath() {
    return `/@${this.account.acct}/${this.id}`;
  }

  private _account: Account | null = null;
  get account() {
    return (this._account ??= new Account(this.values.account, this.emojiToUrlMap));
  }

  get id() {
    return this.values.id;
  }

  get timelineId() {
    return this.rebloggedId;
  }

  get content() {
    return this.values.content;
  }

  get spoiler() {
    return this.values.spoiler_text || this.values.text || stripTags(this.values.content);
  }

  get application() {
    return this.values.application;
  }

  get created_at() {
    return this.values.created_at;
  }

  get counters(): Counters {
    return {
      replied: this.values.replies_count ?? 0,
      favorited: this.values.favourites_count ?? 0,
      reblogged: this.values.reblogs_count ?? 0,
    };
  }

  async resolveEmojis(resolver: EmojiResolver, instance: RemoteInstance = DefaultInstance): Promise<this> {
    const emojiToUrlMap = await Promise.all([
      resolveStatusEmojis(this.values, resolver, instance),
      resolveAccountEmojis(this.values.account, resolver, instance),
    ]).then(xs => xs.reduce((a, b) => a.concat(b)));

    // @ts-ignore
    return new RebloggedStatus(
      rewriteStatusContentEmojis(this.values, emojiToUrlMap),
      this.rebloggedBy,
      this.rebloggedId,
      emojiToUrlMap
    );
  }

  override withResolvedEmojiToUrlMap(map: Immutable.Map<string, string>): this {
    // @ts-ignore
    return new RebloggedStatus(this.values, this.rebloggedBy, this.rebloggedId, map);
  }
}

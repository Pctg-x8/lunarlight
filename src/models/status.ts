import { stripTags } from "@/utils";
import { Account } from "./account";
import { DefaultInstance, EmptyRequestBody, RemoteInstance } from "./api";
import { Status as ApiStatusData, Application, getStatus } from "./api/mastodon/status";
import EmojiResolver from "./emoji";
import { CustomInstanceOption } from "./requestOptions";

export type Counters = {
  readonly replied: number;
  readonly favorited: number;
  readonly reblogged: number;
};

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
}

export class NormalStatus extends Status {
  constructor(readonly values: ApiStatusData) {
    super();
  }

  get previewPath() {
    return `/@${this.account.acct}/${this.timelineId}`;
  }

  private _account: Account | null = null;
  get account() {
    return (this._account ??= new Account(this.values.account));
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
    // @ts-ignore
    return new NormalStatus(await resolver.resolveAllInStatus(this.values, instance));
  }
}

export class RebloggedStatus extends Status {
  constructor(readonly values: ApiStatusData, readonly rebloggedBy: Account, readonly rebloggedId: string) {
    super();
  }

  get previewPath() {
    return `/@${this.account.acct}/${this.id}`;
  }

  private _account: Account | null = null;
  get account() {
    return (this._account ??= new Account(this.values.account));
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
    // @ts-ignore
    return new RebloggedStatus(
      await resolver.resolveAllInStatus(this.values, instance),
      this.rebloggedBy,
      this.rebloggedId
    );
  }
}

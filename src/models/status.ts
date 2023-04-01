import { stripTags } from "@/utils";
import { Account } from "./api/mastodon/account";
import { Application, Status as ApiStatusData } from "./api/mastodon/status";

export type Counters = {
  readonly replied: number;
  readonly favorited: number;
  readonly reblogged: number;
};
export abstract class Status {
  static fromApiData(data: ApiStatusData): Status {
    if (data.reblog) {
      return new RebloggedStatus(data.reblog, data.account, data.id);
    }

    return new NormalStatus(data);
  }

  abstract readonly previewPath: string;
  abstract readonly account: Account;
  abstract readonly timelineId: string;
  abstract readonly content: string;
  abstract readonly spoiler: string;
  abstract readonly application: Application | undefined;
  abstract readonly created_at: string;
  abstract readonly counters: Counters;
}

export class NormalStatus extends Status {
  constructor(readonly values: ApiStatusData) {
    super();
  }

  get previewPath() {
    return `/@${this.account.acct}/${this.timelineId}`;
  }

  get account() {
    return this.values.account;
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
}

export class RebloggedStatus extends Status {
  constructor(readonly values: ApiStatusData, readonly rebloggedBy: Account, readonly rebloggedId: string) {
    super();
  }

  get previewPath() {
    return `/@${this.account.acct}/${this.id}`;
  }

  get account() {
    return this.values.account;
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
}

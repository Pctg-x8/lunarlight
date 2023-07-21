import { MisskeyStdAPI } from "./base";

export type EmojiDetailed = {
  readonly id: string;
  readonly aliases?: string[];
  readonly name: string;
  readonly category: string | null;
  readonly host: string | null;
  readonly url: string;
  // ここから下はあまり使わないかも
  readonly license: string | null;
  readonly isSensitive: boolean;
  readonly localOnly: boolean;
  readonly roleIdsThatCanBeUsedThisEmojiAsReaction: string[];
};

export type EmojiRequestParams = {
  readonly name: string;
};

export const getEmojiDetails = new MisskeyStdAPI<EmojiRequestParams, EmojiDetailed>("api/emoji");

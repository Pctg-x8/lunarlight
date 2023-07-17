import { GetAPI, JsonRequestBody } from "..";

export type MetaParams = {
  /** @default true */
  readonly detail?: boolean;
};

export type Emoji = {
  readonly id: string;
  readonly aliases: string[];
  readonly category: string | null;
  readonly host: string | null;
  readonly url: string;
};

export type InstanceMetadata = {
  readonly emojis: Emoji[];
};

export const getInstanceMeta = new GetAPI<JsonRequestBody<MetaParams>, InstanceMetadata>("api/meta");

import { EmptyRequestBody, GetAPI } from "..";

export type Instance = {
  readonly domain: string;
};

export type CustomEmoji = {
  readonly shortcode: string;
  readonly url: string;
  readonly static_url: string;
  readonly visible_in_picker: string;
  readonly category: string;
};

export const getInstanceData = new GetAPI<EmptyRequestBody, Instance>("api/v2/instance", {
  cacheOptions: "force-cache",
});
export const getCustomEmojis = new GetAPI<EmptyRequestBody, CustomEmoji[]>("api/v1/custom_emojis");

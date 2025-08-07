import Immutable from "immutable";

export const EmojiPattern = /:([^:\/]+):/g;
export type EmojiNameFragment<N extends string> = `:${N}:`;
export function isEmojiName(input: string): input is EmojiNameFragment<string> {
  return input.startsWith(":") && input.endsWith(":");
}
export function extractEmojiName<N extends string>(input: EmojiNameFragment<N>): N {
  return input.slice(1, -1) as N;
}

export function rewriteHtmlTextEmojis(source: string, emojiToUrlMap: Immutable.Map<string, string>): string {
  return emojiToUrlMap.reduce(
    (c, u, e) => c.replaceAll(`:${e}:`, `<img src="${u}" alt=":${e}:" title=":${e}:">`),
    source
  );
}

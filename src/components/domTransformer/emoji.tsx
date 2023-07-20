import { Account } from "@/models/account";
import { intersperse } from "@/utils";

export type EmojiNameFragment<N extends string> = `:${N}:`;
export function isEmojiName(input: string): input is EmojiNameFragment<string> {
  return input.startsWith(":") && input.endsWith(":");
}
export function extractEmojiName<N extends string>(input: EmojiNameFragment<N>): N {
  return input.slice(1, -1) as N;
}

export function transformDisplayNameTags(account: Account) {
  const splitted = Object.keys(account.emojiToUrlMap).reduce(
    (xs, k) => xs.flatMap(x => intersperse(x.split(`:${k}:`), `:${k}:`)),
    [account.displayName]
  );

  return splitted
    .filter(x => x !== "")
    .map((sp, n) => {
      const emojiUrl = isEmojiName(sp) ? account.emojiToUrlMap.get(extractEmojiName(sp)) : undefined;
      // eslint-disable-next-line @next/next/no-img-element
      return emojiUrl ? <img key={n} src={emojiUrl} alt={sp} title={sp} /> : <span key={n}>{sp}</span>;
    });
}

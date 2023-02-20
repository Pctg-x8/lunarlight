export function stripTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export function ellipsisText(input: string, maxLength = 50): string {
  return input.length > maxLength ? input.slice(0, maxLength) + "..." : input;
}

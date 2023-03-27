export function stripTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export function ellipsisText(input: string, maxLength = 50): string {
  return input.length > maxLength ? input.slice(0, maxLength) + "..." : input;
}

export function baseUrl() {
  // browser: use relative path
  if (typeof window !== "undefined") return process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}${
      process.env.NEXT_PUBLIC_BASE_PATH ?? ""
    }`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
}

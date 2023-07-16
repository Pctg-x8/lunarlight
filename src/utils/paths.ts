import { stripPrefix, stripSuffix } from ".";

/** Full URL for App Root */
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

export function appBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "/";
}

export function realPath(virtualAbsPath: string): string {
  return stripSuffix(appBasePath(), "/") + "/" + stripPrefix(virtualAbsPath, "/");
}

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRpcRouter } from "./app";

function baseUrl() {
  // browser: use relative path
  if (typeof window !== "undefined") return process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
}

export const rpcClient = createTRPCProxyClient<AppRpcRouter>({
  links: [httpBatchLink({ url: `${baseUrl()}/api/trpc` })],
});

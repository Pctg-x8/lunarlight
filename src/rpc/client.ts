import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRpcRouter } from "./app";

function baseUrl() {
  // browser: use relative path
  if (typeof window !== "undefined") return "";

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const rpcClient = createTRPCProxyClient<AppRpcRouter>({
  links: [httpBatchLink({ url: `${baseUrl()}/api/trpc` })],
});
export default rpcClient;

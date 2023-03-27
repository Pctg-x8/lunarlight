import { baseUrl } from "@/utils";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRpcRouter } from "./app";

export const rpcClient = createTRPCProxyClient<AppRpcRouter>({
  links: [httpBatchLink({ url: `${baseUrl()}/api/trpc` })],
});

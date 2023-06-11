import { baseUrl, requireEnv } from "@/utils";
import { createTRPCProxyClient, createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { AppRpcRouter } from "./app";

const wsClient = createWSClient({
  url: requireEnv("WS_SERVER_URL"),
});

export const rpcClient = createTRPCProxyClient<AppRpcRouter>({
  links: [
    splitLink({
      condition: op => op.type === "subscription",
      true: wsLink({ client: wsClient }),
      false: httpBatchLink({ url: `${baseUrl()}/api/trpc` }),
    }),
  ],
});

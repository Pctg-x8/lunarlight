import { baseUrl, throwException } from "@/utils";
import { createTRPCProxyClient, createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { AppRpcRouter } from "./app";

const wsClient = createWSClient({
  url: process.env.NEXT_PUBLIC_WS_SERVER_URL ?? throwException(() => new Error("WebSocket Server is unknown")),
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

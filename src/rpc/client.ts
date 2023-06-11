import { baseUrl } from "@/utils";
import { createTRPCProxyClient, createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { AppRpcRouter } from "./app";

const wsPort = process.env.WS_PORT ?? "3001";
const hostName = process.env.WS_HOST ?? window.location.hostname;
const wsClient = createWSClient({
  url: `wss://${hostName}:${wsPort}/streaming`,
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

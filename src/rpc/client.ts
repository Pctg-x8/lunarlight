import { baseUrl } from "@/utils";
import { createTRPCProxyClient, createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { AppRpcRouter } from "./app";

const wsPort = process.env.WS_PORT ?? "3001";
const wsClient = createWSClient({
  // TODO: あとで正しいのをなんとかして取る
  url: `ws://localhost:${wsPort}/`,
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

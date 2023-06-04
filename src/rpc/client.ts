import { baseUrl } from "@/utils";
import { createTRPCProxyClient, createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { AppRpcRouter } from "./app";

const wsClient = createWSClient({
  // TODO: あとで正しいのをなんとかして取る
  url: `ws://localhost:3000/api/trpc`,
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

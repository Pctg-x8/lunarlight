import { createAppLogger } from "@/logger";
import { appRpcRouter, createContext } from "@/rpc/app";
import * as trpcNext from "@trpc/server/adapters/next";

const AppLogger = createAppLogger({ name: "trpc-error" });

export default trpcNext.createNextApiHandler({
  router: appRpcRouter,
  createContext,
  onError: ({ error, path }) => {
    console.error(error);
    AppLogger.error(error, `RPC Error while requesting "${path}"`);
  },
});

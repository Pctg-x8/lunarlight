import { appRpcRouter, createContext } from "@/rpc/app";
import * as trpcNext from "@trpc/server/adapters/next";
import pino from "pino";

const AppLogger = pino({ name: "trpc-error" });

export default trpcNext.createNextApiHandler({
  router: appRpcRouter,
  createContext,
  onError: ({ error, path, input }) => {
    AppLogger.error({ error, path, input });
  }
});

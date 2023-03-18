import { appRpcRouter } from "@/rpc/app";
import * as trpcNext from "@trpc/server/adapters/next";

export default trpcNext.createNextApiHandler({
  router: appRpcRouter,
  createContext: () => ({})
});

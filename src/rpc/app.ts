import { initTRPC } from "@trpc/server";

const t = initTRPC.create();
export const appRpcRouter = t.router({});
export type AppRpcRouter = typeof appRpcRouter;

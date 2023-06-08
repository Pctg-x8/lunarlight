import { createAppLogger } from "@/logger";
import { AUTHORIZATION_TOKEN_COOKIE_NAME } from "@/models/auth";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import cookie from "cookie";
import ws from "ws";
import { appRpcRouter } from "./app";

// based: https://github.com/trpc/examples-next-prisma-websockets-starter/blob/main/src/server/wssDevServer.ts

const Logger = createAppLogger({ name: "WebSocket Server" });

const Port = Number(process.env.WS_PORT ?? 3001);
const wss = new ws.Server({ port: Port });
const handler = applyWSSHandler({
  wss,
  router: appRpcRouter,
  createContext: ctx => ({
    getAuthorizedToken: () => {
      if (!ctx.req.headers.cookie) return undefined;
      return cookie.parse(ctx.req.headers.cookie)[AUTHORIZATION_TOKEN_COOKIE_NAME];
    },
    setAuthorizedToken: _ => {
      throw new Error("cannot set cookie from websocket session");
    },
    clearAuthorizedToken: () => {
      throw new Error("cannot set cookie from websocket session");
    },
  }),
});
wss.on("connection", c => {
  Logger.trace({ url: c.url }, "connection");
  c.once("close", () => {
    Logger.trace({ url: c.url }, "close");
  });
});
process.on("SIGTERM", () => {
  Logger.trace("sigterm");
  handler.broadcastReconnectNotification();
  wss.close();
});

Logger.info({ port: Port }, "start");

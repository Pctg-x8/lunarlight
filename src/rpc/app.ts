import { DefaultInstance, FormDataRequestBody, HTTPError, SearchParamsRequestBody } from "@/models/api";
import { buildAuthorizeUrl, createApp } from "@/models/api/mastodon/apps";
import { getStatusesForAccount } from "@/models/api/mastodon/status";
import { HomeTimelineRequestParamsZ, homeTimeline } from "@/models/api/mastodon/timeline";
import { AppData } from "@/models/app";
import { getAuthorizationToken, setAuthorizationToken } from "@/models/auth";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import pino from "pino";
import z from "zod";

const apiAccessLogger = pino({ name: "trpc" });

export async function createContext(opts: CreateNextContextOptions) {
  return {
    getAuthorizedToken: () => getAuthorizationToken(opts.req),
    setAuthorizedToken: (newToken: string) => setAuthorizationToken(newToken)(opts.res),
    clearAuthorizedToken: () => setAuthorizationToken("")(opts.res),
  };
}

const t = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();
const requireAuthorized = t.middleware(async ({ ctx, next }) => {
  const token = ctx.getAuthorizedToken();
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });

  return await next({ ctx: { token } });
});
const accessLogger = t.middleware(async ({ path, input, next }) => {
  apiAccessLogger.info({ path, input });
  const r = await next();
  apiAccessLogger.info({ path, input, success: r.ok });
  return r;
});

const stdProcedure = t.procedure.use(accessLogger);

export const appRpcRouter = t.router({
  logout: stdProcedure.mutation(({ ctx }) => {
    ctx.clearAuthorizedToken();
  }),
  loginUrl: stdProcedure.query(async () => {
    try {
      const app = await DefaultInstance.queryAppInfo((instance) =>
        createApp.send(new FormDataRequestBody(AppData), instance)
      );

      return buildAuthorizeUrl(DefaultInstance, {
        response_type: "code",
        client_id: app.client_id,
        redirect_uri: AppData.redirect_uris,
        scope: AppData.scopes,
      });
    } catch (e) {
      if (e instanceof HTTPError.HTTPErrorBase) {
        console.error(e, await e.readResponseJson());
      } else {
        console.error(e);
      }

      throw e;
    }
  }),
  account: t.router({
    statuses: stdProcedure
      .input(z.object({ accountId: z.string(), max_id: z.string().optional(), limit: z.number().optional() }))
      .query(({ input, ctx }) => {
        const tok = ctx.getAuthorizedToken();
        const instance = tok ? DefaultInstance.withAuthorizationToken(tok) : DefaultInstance;

        return getStatusesForAccount(input.accountId).send(
          new SearchParamsRequestBody({
            max_id: input.max_id,
            limit: input.limit,
          }),
          instance
        );
      }),
  }),
  homeTimeline: stdProcedure
    .use(requireAuthorized)
    .input(HomeTimelineRequestParamsZ)
    .query(async ({ input, ctx: { token } }) => {
      try {
        return await homeTimeline.send(
          new SearchParamsRequestBody(input),
          DefaultInstance.withAuthorizationToken(token)
        );
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
});
export type AppRpcRouter = typeof appRpcRouter;

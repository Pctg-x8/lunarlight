import { DefaultInstance, FormDataRequestBody, SearchParamsRequestBody } from "@/models/api";
import { revokeToken } from "@/models/api/mastodon/apps";
import { getStatusesForAccount } from "@/models/api/mastodon/status";
import { HomeTimelineRequestParamsZ, homeTimeline } from "@/models/api/mastodon/timeline";
import { CreateAppRequest } from "@/models/app";
import { getAuthorizationToken, getLoginUrl, setAuthorizationToken } from "@/models/auth";
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
  const r = await next();
  apiAccessLogger.info({ path, input, success: r.ok });
  return r;
});

const stdProcedure = t.procedure.use(accessLogger);

export const appRpcRouter = t.router({
  logout: stdProcedure.mutation(async ({ ctx }) => {
    const token = ctx.getAuthorizedToken();
    if (!token) return;

    const app = await DefaultInstance.queryAppInfo(instance => instance.send(CreateAppRequest));
    await revokeToken.send(
      new FormDataRequestBody({
        client_id: app.client_id,
        client_secret: app.client_secret,
        token,
      }),
      DefaultInstance
    );
    ctx.clearAuthorizedToken();
  }),
  loginUrl: stdProcedure.query(getLoginUrl),
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
    .query(({ input, ctx: { token } }) =>
      homeTimeline.send(new SearchParamsRequestBody(input), DefaultInstance.withAuthorizationToken(token))
    ),
});
export type AppRpcRouter = typeof appRpcRouter;

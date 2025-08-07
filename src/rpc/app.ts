import { createAppLogger } from "@/logger";
import { DefaultInstance, FormDataRequestBody, SearchParamsRequestBody } from "@/models/api";
import { revokeToken } from "@/models/api/mastodon/apps";
import { getStatusesForAccount } from "@/models/api/mastodon/status";
import { Event, StreamsType } from "@/models/api/mastodon/streaming";
import {
  HomeTimelineRequestParamsZ,
  PublicTimelineRequestParamsZ,
  homeTimeline,
  publicTimeline,
} from "@/models/api/mastodon/timeline";
import { CreateAppRequest } from "@/models/app";
import { getAuthorizationToken, getLoginUrl, setAuthorizationToken_APIResModifier } from "@/models/auth";
import EmojiResolver from "@/models/emoji";
import { Status, resolveStatusEmojis } from "@/models/status";
import "@/superJsonExtraInitializers";
import { TRPCError, initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { observable } from "@trpc/server/observable";
import superjson from "superjson";
import ws from "ws";
import z from "zod";

const apiAccessLogger = createAppLogger({ name: "trpc" });

export async function createContext(opts: CreateNextContextOptions) {
  return {
    getAuthorizedToken: () => getAuthorizationToken(opts.req),
    setAuthorizedToken: (newToken: string) => setAuthorizationToken_APIResModifier(newToken)(opts.res),
    clearAuthorizedToken: () => setAuthorizationToken_APIResModifier("")(opts.res),
  };
}

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create({ transformer: superjson });
const requireAuthorized = t.middleware(async ({ ctx, next }) => {
  const token = ctx.getAuthorizedToken();
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });

  return await next({ ctx: { token } });
});
const maybeAuthorized = t.middleware(async ({ ctx, next }) => {
  return await next({ ctx: { token: ctx.getAuthorizedToken() } });
});
const accessLogger = t.middleware(async (opts) => {
  const start = Date.now();
  const r = await opts.next();
  const elapsed = Date.now() - start;
  if (r.ok) {
    apiAccessLogger.info({ path: opts.path, duration_ms: elapsed });
  } else {
    apiAccessLogger.error({ path: opts.path, duration_ms: elapsed, error: r.error });
  }
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
        const emojiResolver = new EmojiResolver();

        return getStatusesForAccount(input.accountId)
          .send(
            new SearchParamsRequestBody({
              max_id: input.max_id,
              limit: input.limit,
            }),
            instance
          )
          .then(xs => Promise.all(xs.map(s => Status.fromApiData(s).resolveEmojis(emojiResolver))));
      }),
  }),
  homeTimeline: stdProcedure
    .use(requireAuthorized)
    .input(HomeTimelineRequestParamsZ)
    .query(({ input, ctx: { token } }) => {
      const emojiResolver = new EmojiResolver();
      const instance = DefaultInstance.withAuthorizationToken(token);
      return homeTimeline
        .send(new SearchParamsRequestBody(input), instance)
        .then(xs => Promise.all(xs.map(s => Status.fromApiData(s).resolveEmojis(emojiResolver))));
    }),
  publicTimeline: stdProcedure
    .use(maybeAuthorized)
    .input(PublicTimelineRequestParamsZ)
    .query(async ({ input, ctx: { token } }) => {
      const emojiResolver = new EmojiResolver();
      const instance = token ? DefaultInstance.withAuthorizationToken(token) : DefaultInstance;

      const xs = await publicTimeline.send(new SearchParamsRequestBody(input), instance);
      return await Promise.all(xs.map(s => Status.fromApiData(s).resolveEmojis(emojiResolver)));
    }),
  streamingTimeline: stdProcedure
    .use(requireAuthorized)
    .input(z.object({ stream: StreamsType }))
    .subscription(({ input, ctx: { token } }) =>
      observable<Event, unknown>(observer => {
        const params = new SearchParamsRequestBody({
          access_token: token,
          stream: input.stream,
        });

        const url = params.tweakURL(DefaultInstance.buildFullUrl("/api/v1/streaming"));
        url.protocol = "wss:";
        const client = new ws(url);
        const emojiResolver = new EmojiResolver();
        client.on("message", async (msg, isBinary) => {
          if (isBinary) {
            console.log("unknown binary msg", msg);
            return;
          }

          let msgString: string;
          if (msg instanceof Array) {
            // chunked

            const decoder = new TextDecoder();
            msgString = msg.reduce((a, b) => a + decoder.decode(b, { stream: true }), "");
          } else {
            // not chunked

            msgString = new TextDecoder().decode(msg);
          }

          const e: Event = JSON.parse(msgString);
          if (e.event === "update") {
            // payload is Status
            // Note: これたぶん表示順が前後するパターンがありそうなので別途キューイングするかクライアント側で並べ替える必要がありそう
            const resolvedStatus = await resolveStatusEmojis(JSON.parse(e.payload), emojiResolver, DefaultInstance);
            msgString = JSON.stringify({ ...e, payload: JSON.stringify(resolvedStatus) });
          }

          observer.next(e);
        });

        return () => {
          client.close();
        };
      })
    ),
});
export type AppRpcRouter = typeof appRpcRouter;

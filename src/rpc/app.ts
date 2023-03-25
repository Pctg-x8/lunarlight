import { DefaultInstance, EmptyRequestBody, FormDataRequestBody, HTTPError } from "@/models/api";
import { verifyCredentials } from "@/models/api/mastodon/account";
import { buildAuthorizeUrl, buildScopes, createApp } from "@/models/api/mastodon/apps";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import cookie from "cookie";

const DAY_SECONDS = 24 * 60 * 60;

export async function createContext(opts: CreateNextContextOptions) {
  const setAuthorizedToken = (newToken: string) => {
    opts.res.setHeader(
      "Set-Cookie",
      cookie.serialize("_lla", newToken, {
        httpOnly: true,
        maxAge: 30 * DAY_SECONDS,
        sameSite: "lax",
      })
    );
  };

  return {
    getAuthorizedToken: () => opts.req.cookies["_lla"],
    setAuthorizedToken: (newToken: string) => setAuthorizedToken(newToken),
    clearAuthorizedToken: () => setAuthorizedToken(""),
  };
}

const t = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();
export const appRpcRouter = t.router({
  authorizedAccount: t.procedure.query(async ({ ctx }) => {
    const token = ctx.getAuthorizedToken();
    if (!token) return null;

    const instance = DefaultInstance.withAuthorizationToken(token);
    try {
      return await verifyCredentials.send(EmptyRequestBody.instance, instance);
    } catch (e) {
      if (
        e instanceof HTTPError.ForbiddenError ||
        e instanceof HTTPError.UnauthorizedError ||
        e instanceof HTTPError.UnprocessableEntityError
      ) {
        ctx.clearAuthorizedToken();
        return null;
      }

      // unprocessable
      throw e;
    }
  }),
  loginUrl: t.procedure.query(async () => {
    try {
      const redirect_to = "http://localhost:3000/api/authorize";
      const scopes = buildScopes("read", "write", "push");
      const app = await DefaultInstance.queryAppInfo((instance) =>
        createApp.send(
          new FormDataRequestBody({
            client_name: "Lunarlight",
            redirect_uris: redirect_to,
            scopes,
            website: "https://crescent.ct2.io/ll/",
          }),
          instance
        )
      );

      return buildAuthorizeUrl(DefaultInstance, {
        response_type: "code",
        client_id: app.client_id,
        redirect_uri: redirect_to,
        scope: scopes,
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
});
export type AppRpcRouter = typeof appRpcRouter;

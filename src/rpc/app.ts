import { DefaultInstance, EmptyRequestBody, FormDataRequestBody, HTTPError } from "@/models/api";
import { verifyCredentials } from "@/models/api/mastodon/account";
import { buildAuthorizeUrl, createApp } from "@/models/api/mastodon/apps";
import { AppData } from "@/models/app";
import { getAuthorizationToken, setAuthorizationToken } from "@/models/auth";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export async function createContext(opts: CreateNextContextOptions) {
  return {
    getAuthorizedToken: () => getAuthorizationToken(opts.req),
    setAuthorizedToken: (newToken: string) => setAuthorizationToken(newToken)(opts.res),
    clearAuthorizedToken: () => setAuthorizationToken("")(opts.res),
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
});
export type AppRpcRouter = typeof appRpcRouter;

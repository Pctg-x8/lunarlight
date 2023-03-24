import ProdInstance, { HTTPError } from "@/models/api";
import { verifyCredentials } from "@/models/api/mastodon/account";
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
  getAuthorizedAccount: t.procedure.query(async ({ ctx }) => {
    const token = ctx.getAuthorizedToken();
    if (!token) return null;

    const instance = new ProdInstance().withAuthorizationToken(token);
    try {
      return await verifyCredentials.send({}, instance);
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
});
export type AppRpcRouter = typeof appRpcRouter;

import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { DefaultInstance, EmptyRequestBody, FormDataRequestBody, HTTPError } from "./api";
import { CredentialAccount, verifyCredentials } from "./api/mastodon/account";
import { buildAuthorizeUrl, createApp } from "./api/mastodon/apps";
import { AppData } from "./app";

const DAY_SECONDS = 24 * 60 * 60;

export type RequestExtractor<T> = (req: NextApiRequest) => T;
export type ResponseModifier = (res: NextApiResponse) => void;

export const AUTHORIZATION_TOKEN_COOKIE_NAME = "_lla";
export function getAuthorizationToken(req: NextApiRequest): string | undefined {
  return req.cookies[AUTHORIZATION_TOKEN_COOKIE_NAME];
}
export function setAuthorizationToken(token: string): ResponseModifier {
  return res =>
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(AUTHORIZATION_TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * DAY_SECONDS,
        sameSite: "lax",
        path: process.env.NEXT_PUBLIC_BASE_PATH ?? "/",
      })
    );
}

export async function getAuthorizedAccount(token: string): Promise<CredentialAccount | null> {
  const instance = DefaultInstance.withAuthorizationToken(token);
  try {
    return await verifyCredentials.send(EmptyRequestBody.instance, instance);
  } catch (e) {
    if (
      e instanceof HTTPError.ForbiddenError ||
      e instanceof HTTPError.UnauthorizedError ||
      e instanceof HTTPError.UnprocessableEntityError
    ) {
      return null;
    }

    // unprocessable
    throw e;
  }
}

export async function getAuthorizedAccountSSR(): Promise<CredentialAccount | null> {
  const token = cookies().get(AUTHORIZATION_TOKEN_COOKIE_NAME);
  if (!token) return null;

  return await getAuthorizedAccount(token.value);
}

export async function getLoginUrl() {
  const app = await DefaultInstance.queryAppInfo(instance =>
    createApp.send(new FormDataRequestBody(AppData), instance)
  );

  return buildAuthorizeUrl(DefaultInstance, {
    response_type: "code",
    client_id: app.client_id,
    redirect_uri: AppData.redirect_uris,
    scope: AppData.scopes,
  });
}

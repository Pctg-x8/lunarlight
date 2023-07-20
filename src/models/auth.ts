import { appBasePath } from "@/utils/paths";
import { StateModifier } from "@/utils/stateModifier";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DefaultInstance, EmptyRequestBody, HTTPError } from "./api";
import { CredentialAccount, verifyCredentials } from "./api/mastodon/account";
import { buildAuthorizeUrl } from "./api/mastodon/apps";
import { AppData, CreateAppRequest } from "./app";

const DAY_SECONDS = 24 * 60 * 60;

export type RequestExtractor<T> = (req: NextApiRequest) => T;
export type ApiResponseModifier = (res: NextApiResponse) => void;
export type ResponseModifier = StateModifier<NextResponse>;

export const AUTHORIZATION_TOKEN_COOKIE_NAME = "_lla";
export function ssrGetAuthorizationToken(): string | undefined {
  return cookies().get(AUTHORIZATION_TOKEN_COOKIE_NAME)?.value;
}
export function getAuthorizationToken(req: NextApiRequest): string | undefined {
  return req.cookies[AUTHORIZATION_TOKEN_COOKIE_NAME];
}
export function setAuthorizationToken(token: string): ResponseModifier {
  return res => {
    res.cookies.set(AUTHORIZATION_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * DAY_SECONDS,
      sameSite: "lax",
      path: appBasePath(),
    });

    return res;
  };
}
export function setAuthorizationToken_APIResModifier(token: string): ApiResponseModifier {
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
  const token = ssrGetAuthorizationToken();
  if (!token) return null;

  return await getAuthorizedAccount(token);
}

export async function getLoginUrl() {
  const app = await DefaultInstance.queryAppInfo(instance => instance.send(CreateAppRequest));

  return buildAuthorizeUrl(DefaultInstance, {
    response_type: "code",
    client_id: app.client_id,
    redirect_uri: AppData.redirect_uris,
    scope: AppData.scopes,
  });
}

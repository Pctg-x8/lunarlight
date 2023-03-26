import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const DAY_SECONDS = 24 * 60 * 60;

export type RequestExtractor<T> = (req: NextApiRequest) => T;
export type ResponseModifier = (res: NextApiResponse) => void;

export const AUTHORIZATION_TOKEN_COOKIE_NAME = "_lla";
export function getAuthorizationToken(req: NextApiRequest): string | undefined {
  return req.cookies[AUTHORIZATION_TOKEN_COOKIE_NAME];
}
export function setAuthorizationToken(token: string): ResponseModifier {
  return res => res.setHeader(
    "Set-Cookie",
    cookie.serialize(AUTHORIZATION_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: 30 * DAY_SECONDS,
      sameSite: "lax",
    }));
}

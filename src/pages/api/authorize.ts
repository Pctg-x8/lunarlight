import { DefaultInstance, FormDataRequestBody, HTTPError } from "@/models/api";
import { buildScopes, createApp, obtainToken } from "@/models/api/mastodon/apps";
import { setAuthorizationToken } from "@/models/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
  const code = req.query["code"];
  if (!code || code instanceof Array) {
    resp.statusCode = 400;
    return;
  }

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
    const token = await obtainToken.send(
      new FormDataRequestBody({
        grant_type: "authorization_code",
        code,
        client_id: app.client_id,
        client_secret: app.client_secret,
        redirect_uri: redirect_to,
        scope: scopes,
      }),
      DefaultInstance
    );

    setAuthorizationToken(token.access_token)(resp);
    resp.redirect(302, "/");
  } catch (e) {
    if (e instanceof HTTPError.HTTPErrorBase) {
      console.error("api error", e, await e.readResponseJson());
    } else {
      console.error("api error", e);
    }

    throw e;
  }
}

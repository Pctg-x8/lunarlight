import { DefaultInstance, FormDataRequestBody, HTTPError } from "@/models/api";
import { createApp, obtainToken } from "@/models/api/mastodon/apps";
import { AppData } from "@/models/app";
import { setAuthorizationToken } from "@/models/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
  const code = req.query["code"];
  if (!code || code instanceof Array) {
    resp.statusCode = 400;
    return;
  }

  try {
    const app = await DefaultInstance.queryAppInfo((instance) =>
      createApp.send(new FormDataRequestBody(AppData), instance)
    );
    const token = await obtainToken.send(
      new FormDataRequestBody({
        grant_type: "authorization_code",
        code,
        client_id: app.client_id,
        client_secret: app.client_secret,
        redirect_uri: AppData.redirect_uris,
        scope: AppData.scopes,
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

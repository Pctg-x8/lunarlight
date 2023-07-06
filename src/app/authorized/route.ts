import { createAppLogger } from "@/logger";
import { DefaultInstance, FormDataRequestBody } from "@/models/api";
import { obtainToken } from "@/models/api/mastodon/apps";
import { AppData, CreateAppRequest } from "@/models/app";
import { setAuthorizationToken } from "@/models/auth";
import { baseUrl } from "@/utils/paths";
import { stateModifierPipe } from "@/utils/stateModifier";
import { NextResponse } from "next/server";

const ErrorLogger = createAppLogger({ name: "authorize error" });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.next({
      status: 400,
    });
  }

  try {
    const app = await DefaultInstance.queryAppInfo(instance => CreateAppRequest.send(instance));
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

    return stateModifierPipe(NextResponse.redirect(baseUrl()), setAuthorizationToken(token.access_token));
  } catch (e) {
    ErrorLogger.error(e);
    throw e;
  }
}

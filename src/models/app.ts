import { baseUrl } from "@/utils/paths";
import { FormDataRequestBody } from "./api";
import { buildScopes, createApp } from "./api/mastodon/apps";

export const AppData = {
  client_name: process.env.NODE_ENV === "production" ? "Lunarlight" : `Lunarlight(${process.env.NODE_ENV})`,
  redirect_uris: `${baseUrl()}/authorized`,
  scopes: buildScopes("read", "write", "push"),
  website: "https://crescent.ct2.io/ll/",
};

export const CreateAppRequest = createApp.withArgs(new FormDataRequestBody(AppData));

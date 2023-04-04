import { baseUrl } from "@/utils";
import { buildScopes } from "./api/mastodon/apps";

export const AppData = {
  client_name: process.env.NODE_ENV === "production" ? "Lunarlight" : `Lunarlight(${process.env.NODE_ENV})`,
  redirect_uris: `${baseUrl()}/api/authorize`,
  scopes: buildScopes("read", "write", "push"),
  website: "https://crescent.ct2.io/ll/",
};

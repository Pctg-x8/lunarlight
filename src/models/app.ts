import { baseUrl } from "@/utils";
import { buildScopes } from "./api/mastodon/apps";

export const AppData = {
  client_name: "Lunarlight",
  redirect_uris: `${baseUrl()}/api/authorize`,
  scopes: buildScopes("read", "write", "push"),
  website: "https://crescent.ct2.io/ll/",
};

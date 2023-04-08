import { FormDataRequestBody, PostAPI, RemoteInstance } from "..";

export type Application = {
  readonly id: string;
  readonly client_id: string;
  readonly client_secret: string;
  readonly vapid_key: string;
};

export type Token = {
  readonly access_token: string;
  readonly created_at: number;
};

export type CreateAppRequestParams = {
  readonly client_name: string;
  readonly redirect_uris: string;
  readonly scopes?: string;
  readonly website?: string;
};

export type AuthorizeQueryParams = {
  readonly response_type: string;
  readonly client_id: string;
  readonly redirect_uri: string;
  readonly scope?: string;
  readonly force_login?: boolean;
  readonly lang?: string;
};

type ObtainTokenRequestParams = {
  readonly grant_type: string;
  readonly code: string;
  readonly client_id: string;
  readonly client_secret: string;
  readonly redirect_uri: string;
  readonly scope: string;
};

export type RevokeTokenRequestParams = {
  readonly client_id: string;
  readonly client_secret: string;
  readonly token: string;
};

export const createApp = new PostAPI<FormDataRequestBody<CreateAppRequestParams>, Application>("api/v1/apps");
export const obtainToken = new PostAPI<FormDataRequestBody<ObtainTokenRequestParams>, Token>("oauth/token");
export const revokeToken = new PostAPI<FormDataRequestBody<RevokeTokenRequestParams>>("oauth/revoke");

export function buildAuthorizeUrl(instance: RemoteInstance, params: AuthorizeQueryParams): URL {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, v.toString()])
    )
  );
  const url = instance.buildFullUrl("/oauth/authorize");
  url.search = "?" + qs.toString();

  return url;
}

export function buildScopes(...scopes: string[]): string {
  return scopes.join(" ");
}

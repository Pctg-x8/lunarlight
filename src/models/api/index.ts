// @ts-ignore
import { URL } from "universal-url";

export interface RemoteInstance {
  buildFullUrl(path: string): URL;

  setExtraHeaders<Ks extends string | number | symbol>(headers: Record<Ks, string>): Record<Ks, string>;
}
export interface IAuthorizationProvider {}

export default class ProdInstance implements RemoteInstance {
  readonly baseUrl = new URL("https://crescent.ct2.io/");

  buildFullUrl(path: string): URL {
    return new URL(path, this.baseUrl);
  }

  setExtraHeaders<Ks extends string | number | symbol>(headers: Record<Ks, string>): Record<Ks, string> {
    return headers;
  }

  withAuthorizationToken(token: string) {
    return new AuthorizedRemote(this, token);
  }
}

export class AuthorizedRemote implements RemoteInstance, IAuthorizationProvider {
  constructor(private readonly parent: RemoteInstance, private readonly token: string) {}

  buildFullUrl(path: string): URL {
    return this.parent.buildFullUrl(path);
  }

  setExtraHeaders<Ks extends string | number | symbol>(headers: Record<Ks, string>): Record<Ks, string> {
    return { ...this.parent.setExtraHeaders(headers), Authorization: `Bearer ${this.token}` };
  }
}

export type CacheOptions = { readonly cacheOptions?: RequestCache };

export namespace HTTPError {
  export class UnauthorizedError extends Error {
    constructor() {
      super("Unauthorized")
    }
  }

  export class ForbiddenError extends Error {
    constructor() {
      super("Forbidden");
    }
  }

  export class NotFoundError extends Error {
    constructor() {
      super("Not Found");
    }
  }

  export class UnprocessableEntityError extends Error {
    constructor() {
      super("Unprocessable Entity");
    }
  }
}

export type RequestType = Record<string, { toString(): string }> | { asSearchParams(): URLSearchParams };

export interface API<Req, Resp> {
  send(req: Req, client: RemoteInstance): Promise<Resp>;
}

export class GetAPI<Req extends RequestType, Resp> implements API<Req, Resp> {
  constructor(private readonly url: string, private readonly options: CacheOptions = {}) {}

  generateURL(req: Req, client: RemoteInstance): URL {
    let qs: URLSearchParams;
    if ("asSearchParams" in req && typeof req.asSearchParams === "function") {
      qs = req.asSearchParams();
    } else {
      qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(req as Record<string, { toString(): string }>).map(([k, v]) => [k, v.toString()])
        )
      );
    }
    const url = client.buildFullUrl(this.url);
    url.search = "?" + qs.toString();

    return url;
  }

  async send(req: Req, client: RemoteInstance): Promise<Resp> {
    const resp = await fetch(this.generateURL(req, client), {
      method: "GET",
      cache: this.options.cacheOptions,
      headers: client.setExtraHeaders({}),
    });

    if (resp.status === 404) throw new HTTPError.NotFoundError();

    return await resp.json();
  }

  bindParameters(req: Req, client: RemoteInstance): ParameterBoundAPI<GetAPI<Req, Resp>, Req, Resp> {
    return new ParameterBoundAPI(this, req, client);
  }
}

export class AuthorizedGetAPI<Req extends RequestType, Resp> extends GetAPI<Req, Resp> {
  override async send(req: Req, client: RemoteInstance & IAuthorizationProvider): Promise<Resp> {
    return super.send(req, client);
  }
}

export class ParameterBoundAPI<Base extends API<Req, Resp>, Req, Resp> {
  constructor(private readonly base: Base, private readonly req: Req, private readonly instance: RemoteInstance) {}

  async send(): Promise<Resp> {
    return this.base.send(this.req, this.instance);
  }
}

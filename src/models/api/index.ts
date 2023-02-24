// @ts-ignore
import { URL } from "universal-url";

export interface ServerInstance {
  buildFullUrl(path: string): URL;
}

export default class ProdInstance implements ServerInstance {
  readonly baseUrl = new URL("https://crescent.ct2.io/");

  buildFullUrl(path: string): URL {
    return new URL(path, this.baseUrl);
  }
}

export type CacheOptions = { readonly cacheOptions?: RequestCache };

export class NotFoundAPIResponseError extends Error {
  constructor() {
    super("Not Found");
  }
}

export type RequestType = Record<string, { toString(): string }> | { asSearchParams(): URLSearchParams };

export interface API<Req, Resp> {
  send(req: Req, client: ServerInstance): Promise<Resp>;
}

export class GetAPI<Req extends RequestType, Resp> implements API<Req, Resp> {
  constructor(private readonly url: string, private readonly options: CacheOptions = {}) {}

  generateURL(req: Req, client: ServerInstance): URL {
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

  async send(req: Req, client: ServerInstance): Promise<Resp> {
    const resp = await fetch(this.generateURL(req, client), { method: "GET", cache: this.options.cacheOptions });

    if (resp.status === 404) {
      throw new NotFoundAPIResponseError();
    }

    return await resp.json();
  }

  bindParameters(req: Req, client: ServerInstance): ParameterBoundAPI<GetAPI<Req, Resp>, Req, Resp> {
    return new ParameterBoundAPI(this, req, client);
  }
}

export class ParameterBoundAPI<Base extends API<Req, Resp>, Req, Resp> {
  constructor(private readonly base: Base, private readonly req: Req, private readonly instance: ServerInstance) {}

  async send(): Promise<Resp> {
    return this.base.send(this.req, this.instance);
  }
}

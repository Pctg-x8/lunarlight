// @ts-ignore
import { PrismaClient } from "@prisma/client";
// @ts-ignore
import { URL } from "universal-url";
import { Application } from "./mastodon/apps";
import { createAppLogger } from "@/logger";

export interface RemoteInstance {
  buildFullUrl(path: string): URL;
  tweakRequest(req: Request): Request;
  send<Base extends API<Req, Resp>, Req extends RequestBody, Resp>(req: BodyBoundAPI<Base, Req, Resp>): Promise<Resp>;

  queryAppInfo(createOps: (instance: RemoteInstance) => Promise<Application>): Promise<Application>;
}
export interface IAuthorizationProvider {}

declare global {
  var db: PrismaClient | undefined;
}

const db =
  typeof window === "undefined"
    ? global.db ??
      new PrismaClient({ log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error", "info"] })
    : undefined;
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  // cache db connection instance for production hot reloading
  global.db = db;
}

const externalApiRequestLogger = createAppLogger({ name: "ExternalAPIRequest", level: "trace" });

export class ForeignInstance implements RemoteInstance {
  static fromDomainName(domain: string): ForeignInstance {
    return new ForeignInstance(new URL(`https://${domain}`));
  }

  constructor(readonly baseUrl: URL) {}

  buildFullUrl(path: string): URL {
    return new URL(path, this.baseUrl);
  }

  tweakRequest(req: Request): Request {
    return req;
  }

  async queryAppInfo(_createOps: (instance: RemoteInstance) => Promise<Application>): Promise<Application> {
    throw new Error("queryAppInfo for ForeignInstance is not implemented");
  }

  send<Base extends API<Req, Resp>, Req extends RequestBody, Resp>(req: BodyBoundAPI<Base, Req, Resp>): Promise<Resp> {
    return req.send(this);
  }
}

export default class ProdInstance implements RemoteInstance {
  readonly baseUrl = new URL("https://crescent.ct2.io");

  buildFullUrl(path: string): URL {
    return new URL(path, this.baseUrl);
  }

  tweakRequest(req: Request): Request {
    return req;
  }

  private appinfo: Application | null = null;
  async queryAppInfo(createOps: (instance: RemoteInstance) => Promise<Application>): Promise<Application> {
    if (!db) throw new Error("AppInfo cannot query from client-side");

    if (this.appinfo) return this.appinfo;

    const connectedInstanceRecord = await db.connectedInstance.findFirst({ where: { domain: this.baseUrl.host } });
    if (connectedInstanceRecord) {
      // memoize this
      this.appinfo = {
        id: connectedInstanceRecord.id,
        client_id: connectedInstanceRecord.client_id,
        client_secret: connectedInstanceRecord.client_secret,
        vapid_key: connectedInstanceRecord.vapid_key,
      };

      return this.appinfo;
    }

    // create new app
    const app = await createOps(this);
    await db.connectedInstance.create({
      data: {
        domain: this.baseUrl.host,
        id: app.id,
        client_id: app.client_id,
        client_secret: app.client_secret,
        vapid_key: app.vapid_key,
      },
    });
    this.appinfo = app;
    return app;
  }

  withAuthorizationToken(token: string) {
    return new AuthorizedRemote(this, token);
  }

  send<Base extends API<Req, Resp>, Req extends RequestBody, Resp>(req: BodyBoundAPI<Base, Req, Resp>): Promise<Resp> {
    return req.send(this);
  }
}

export const DefaultInstance = new ProdInstance();

export class AuthorizedRemote implements RemoteInstance, IAuthorizationProvider {
  constructor(private readonly parent: RemoteInstance, private readonly token: string) {}

  buildFullUrl(path: string): URL {
    return this.parent.buildFullUrl(path);
  }

  tweakRequest(req: Request): Request {
    return new Request(this.parent.tweakRequest(req), { headers: { Authorization: `Bearer ${this.token}` } });
  }

  queryAppInfo(createOps: (instance: RemoteInstance) => Promise<Application>): Promise<Application> {
    return this.parent.queryAppInfo(createOps);
  }

  send<Base extends API<Req, Resp>, Req extends RequestBody, Resp>(req: BodyBoundAPI<Base, Req, Resp>): Promise<Resp> {
    return req.send(this);
  }
}

export type CacheOptions = { readonly cacheOptions?: RequestCache };

export namespace HTTPError {
  export abstract class HTTPErrorBase extends Error {}

  export class ClientError extends HTTPErrorBase {
    constructor(respText: string) {
      super(`Client Error ${respText}`);
    }
  }

  export class UnauthorizedError extends HTTPErrorBase {
    constructor(respText: string) {
      super(`Unauthorized ${respText}`);
    }
  }

  export class ForbiddenError extends HTTPErrorBase {
    constructor(respText: string) {
      super(`Forbidden ${respText}`);
    }
  }

  export class NotFoundError extends HTTPErrorBase {
    constructor(respText: string) {
      super(`Not Found ${respText}`);
    }
  }

  export class UnprocessableEntityError extends HTTPErrorBase {
    constructor(respText: string) {
      super(`Unprocessable Entity ${respText}`);
    }
  }

  export class InternalServerError extends HTTPErrorBase {
    constructor(respText: string) {
      super(`Internal Server Error ${respText}`);
    }
  }

  export async function sanitizeStatusCode(resp: Response) {
    switch (resp.status) {
      case 400:
        throw new HTTPError.ClientError(await resp.text());
      case 401:
        throw new HTTPError.UnauthorizedError(await resp.text());
      case 403:
        throw new HTTPError.ForbiddenError(await resp.text());
      case 404:
        throw new HTTPError.NotFoundError(await resp.text());
      case 422:
        throw new HTTPError.UnprocessableEntityError(await resp.text());
      case 500:
        throw new HTTPError.InternalServerError(await resp.text());
    }

    return resp;
  }
}

export abstract class RequestBody {
  tweakURL(url: URL): URL {
    return url;
  }

  tweakRequest(req: Request): Request {
    return req;
  }
}
export class EmptyRequestBody extends RequestBody {
  static instance = new EmptyRequestBody();

  private constructor() {
    super();
  }
}
export class SearchParamsRequestBody<
  Params extends Record<string, { toString(): string } | string | undefined>
> extends RequestBody {
  constructor(readonly data: Params) {
    super();
  }

  override tweakURL(url: URL) {
    url.search = new URLSearchParams(
      Object.fromEntries(
        Object.entries(this.data).flatMap(([k, v]) => {
          switch (typeof v) {
            case "undefined":
              return [];
            case "string":
              return [[k, v]];
            default:
              return [[k, v.toString()]];
          }
        })
      )
    );

    return url;
  }
}
export class FormDataRequestBody<Params extends Record<string, { toString(): string }>> extends RequestBody {
  constructor(readonly data: Params) {
    super();
  }

  override tweakRequest(req: Request) {
    return new Request(req, {
      body: new URLSearchParams(Object.fromEntries(Object.entries(this.data).map(([k, v]) => [k, v.toString()]))),
      // @ts-ignore
      duplex: "half",
    });
  }
}
export class JsonRequestBody<Params> extends RequestBody {
  constructor(readonly data: Params) {
    super();
  }

  override tweakRequest(req: Request): Request {
    return new Request(req, {
      body: JSON.stringify(this.data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export abstract class API<Req extends RequestBody, Resp> {
  protected abstract readonly path: string;
  abstract send(req: Req, client: RemoteInstance): Promise<Resp>;

  generateURL(req: Req, client: RemoteInstance): URL {
    return req.tweakURL(client.buildFullUrl(this.path));
  }

  bindParameters(req: Req, client: RemoteInstance): ParameterBoundAPI<this, Req, Resp> {
    return new ParameterBoundAPI(this, req, client);
  }

  withArgs(args: Req): BodyBoundAPI<this, Req, Resp> {
    return new BodyBoundAPI(this, args);
  }
}

export class GetAPI<Req extends RequestBody, Resp> extends API<Req, Resp> {
  constructor(protected readonly path: string, private readonly options: CacheOptions = {}) {
    super();
  }

  override async send(params: Req, client: RemoteInstance): Promise<Resp> {
    const req = new Request(this.generateURL(params, client), {
      method: "GET",
      cache: this.options.cacheOptions,
    });
    externalApiRequestLogger.debug({ url: req.url });
    const resp = await fetch(client.tweakRequest(params.tweakRequest(req)));

    return await (await HTTPError.sanitizeStatusCode(resp)).json();
  }
}

export class AuthorizedGetAPI<Req extends RequestBody, Resp> extends GetAPI<Req, Resp> {
  override async send(req: Req, client: RemoteInstance & IAuthorizationProvider): Promise<Resp> {
    return super.send(req, client);
  }
}

export class PostAPI<Req extends RequestBody, Resp = void> extends API<Req, Resp> {
  constructor(protected readonly path: string, private readonly options: CacheOptions = {}) {
    super();
  }

  override async send(params: Req, client: RemoteInstance): Promise<Resp> {
    const req = new Request(this.generateURL(params, client), {
      method: "POST",
      cache: this.options.cacheOptions,
    });
    const req2 = client.tweakRequest(params.tweakRequest(req));
    const resp = await fetch(req2.url, {
      headers: req2.headers,
      body: req2.body,
      cache: req2.cache,
      method: req2.method,
      // @ts-ignore
      duplex: "half",
    });

    return await (await HTTPError.sanitizeStatusCode(resp)).json();
  }
}

export class AuthorizedPostAPI<Req extends RequestBody, Resp> extends PostAPI<Req, Resp> {
  override async send(req: Req, client: RemoteInstance & IAuthorizationProvider): Promise<Resp> {
    return super.send(req, client);
  }
}

export class ParameterBoundAPI<Base extends API<Req, Resp>, Req extends RequestBody, Resp> {
  constructor(private readonly base: Base, private readonly req: Req, private readonly instance: RemoteInstance) {}

  async send(): Promise<Resp> {
    return this.base.send(this.req, this.instance);
  }
}

export class BodyBoundAPI<Base extends API<Req, Resp>, Req extends RequestBody, Resp> {
  constructor(private readonly base: Base, private readonly req: Req) {}

  async send(instance: RemoteInstance): Promise<Resp> {
    return this.base.send(this.req, instance);
  }

  bindInstance(instance: RemoteInstance): ParameterBoundAPI<Base, Req, Resp> {
    return new ParameterBoundAPI(this.base, this.req, instance);
  }
}

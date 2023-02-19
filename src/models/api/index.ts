import { URL } from "url";

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

export interface API<Resp> {
  send(client: ServerInstance): Promise<Resp>;
}
type ExtractAPIResponseTypes<Args extends API<unknown>[]> = {
  readonly [K in keyof Args]: Args[K] extends API<infer Response> ? Response : never;
};

export class NotFoundAPIResponseError extends Error {
  constructor() {
    super("Not Found");
  }
}

export class GetAPI<Resp> implements API<Resp> {
  constructor(private readonly url: string, private readonly options: CacheOptions = {}) {}

  async send(client: ServerInstance): Promise<Resp> {
    const resp = await fetch(client.buildFullUrl(this.url), { method: "GET", cache: this.options.cacheOptions });

    if (resp.status === 404) {
      throw new NotFoundAPIResponseError();
    }

    return await resp.json();
  }
}

export class CombinedAPI<APIs extends API<unknown>[]> implements API<ExtractAPIResponseTypes<APIs>> {
  static combine<APIs extends API<unknown>[]>(...apis: APIs): CombinedAPI<APIs> {
    return new CombinedAPI(apis);
  }

  constructor(private readonly apis: APIs) {}

  async send(client: ServerInstance): Promise<ExtractAPIResponseTypes<APIs>> {
    return Promise.all(this.apis.map((a) => a.send(client))) as Promise<ExtractAPIResponseTypes<APIs>>;
  }
}

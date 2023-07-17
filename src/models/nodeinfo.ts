import { isDefined } from "@/utils";
import { fst, snd } from "@/utils/tuple";
import { KnownNodeInfo, PrismaClient } from "@prisma/client";
import Immutable from "immutable";

export type WellKnownNodeinfoLinks = {
  readonly links: {
    readonly rel: string;
    readonly href: string;
  }[];
};
export function isLinksData(document: unknown): document is WellKnownNodeinfoLinks {
  return isDefined(document) && typeof document === "object" && "links" in document;
}

export type NodeInfo2 = {
  readonly software: { readonly name: string; readonly version: string };
};
const NODEINFO2_REL_SCHEMA_URL = "http://nodeinfo.diaspora.software/ns/schema/2.0";
export async function resolveNodeInfoFromLinks(links: WellKnownNodeinfoLinks): Promise<NodeInfo2> {
  const candidates = links.links.find(l => l.rel === NODEINFO2_REL_SCHEMA_URL);
  if (!isDefined(candidates)) {
    throw new Error("No available nodeinfo relations found");
  }

  const resp = await fetch(candidates.href, { method: "GET" });
  if (resp.status !== 200) {
    throw new Error(resp.statusText);
  }

  return (await resp.json()) as NodeInfo2;
}

export async function fetchServerNodeinfo(domain: string): Promise<NodeInfo2> {
  const resp = await fetch(`https://${domain}/.well-known/nodeinfo`, { method: "GET" });
  if (resp.status !== 200) {
    throw new Error(resp.statusText);
  }
  const document = await resp.json();

  return isLinksData(document) ? await resolveNodeInfoFromLinks(document) : (document as NodeInfo2);
}

export class NodeInfoResolver {
  private db = new PrismaClient();

  async query(domain: string): Promise<KnownNodeInfo> {
    const results = await this.scheduleBatchRequest(domain);
    console.log("nodeinfo", domain, results[domain]);
    return results[domain];
  }

  // batcher
  private pendingRequests: [string, (result: Record<string, KnownNodeInfo>) => void][] = [];
  private scheduleBatchRequest(domain: string): Promise<Record<string, KnownNodeInfo>> {
    return new Promise(resolve => {
      this.pendingRequests.push([domain, resolve]);
      if (this.pendingRequests.length > 1) {
        // already scheduled
        return;
      }

      queueMicrotask(async () => {
        if (this.pendingRequests.length === 0) {
          // no entries??? nop
          return;
        }

        const requests = this.pendingRequests;
        this.pendingRequests = [];
        const targetDomains = requests.map(fst);

        const results = await this.db.$transaction(async db => {
          // Note: 永続キャッシュにしてるけどsoftware.versionは更新されうるから期限付きキャッシュの方がいいかもしれない
          const cached = await db.knownNodeInfo.findMany({ where: { domain: { in: targetDomains } } });
          const missingDomains = Immutable.Set(targetDomains).subtract(Immutable.Set(cached.map(r => r.domain)));
          const newNodeInfos = await Promise.all(
            missingDomains.map(x => fetchServerNodeinfo(x).then(r => [x, r] as const))
          );
          // TODO: これこうするしかないのか（Prisma5にしたらcreateManyがつかえる？）
          const inserted = await Promise.all(
            newNodeInfos.map(([domain, nodeinfo]) =>
              db.knownNodeInfo.create({
                data: {
                  domain,
                  software_name: nodeinfo.software.name,
                  software_version: nodeinfo.software.version,
                },
              })
            )
          );

          return [...cached, ...inserted];
        });
        const keyed = Object.fromEntries(results.map(r => [r.domain, r] as const));
        for (const waker of requests.map(snd)) {
          waker(keyed);
        }
      });
    });
  }
}

export type APIFamily = "Mastodon" | "Misskey";
export function detectAPIFamily(nodeinfo: KnownNodeInfo): APIFamily | undefined {
  switch (nodeinfo.software_name.toLowerCase()) {
    case "mastodon":
      return "Mastodon";
    case "misskey":
      return "Misskey";
    default:
      return undefined;
  }
}

import { isDefined } from "@/utils";
import { snd } from "@/utils/tuple";
import { PrismaClient, RemoteEmoji } from "@prisma/client";
import Immutable from "immutable";
import { EmptyRequestBody, ForeignInstance, JsonRequestBody } from "./api";
import { getCustomEmojis } from "./api/mastodon/instance";
import { getInstanceMeta } from "./api/misskey/meta";
import { NodeInfoResolver, detectAPIFamily } from "./nodeinfo";

export default class EmojiResolver {
  private readonly db = new PrismaClient();

  async resolveUrl(name: string, preferredDomain?: string): Promise<string | undefined> {
    const results = await this.scheduleRequest(name, preferredDomain);
    return isDefined(preferredDomain) ? results[name]?.[1]?.[preferredDomain] : results[name]?.[0];
  }

  // batching
  private pendingRequests: [
    [string, string | undefined],
    (results: Record<string, [string | undefined, Record<string, string>]>) => void
  ][] = [];
  private async scheduleRequest(
    name: string,
    preferredDomain?: string
  ): Promise<Record<string, [string | undefined, Record<string, string>]>> {
    return new Promise(resolve => {
      this.pendingRequests.push([[name, preferredDomain], resolve]);
      if (this.pendingRequests.length > 1) {
        // already scheduled
        return;
      }

      queueMicrotask(async () => {
        if (this.pendingRequests.length === 0) {
          // no pending??? nop
          return;
        }

        const requests = this.pendingRequests;
        this.pendingRequests = [];

        const results = await this.db.$transaction(async db => {
          const candidates = await this.db.remoteEmoji.findMany({
            where: {
              name: { in: requests.map(([[n]]) => n) },
            },
          });
          const requiredFetching: (readonly [string, string])[] = [];
          const found: Record<string, [string | undefined, Record<string, string>]> = {};
          for (const [[n, pd]] of requests) {
            if (isDefined(pd)) {
              const exact = candidates.find(x => x.name === n && x.domain === pd);
              if (exact) {
                // ドメイン含め完全一致であった
                if (!(n in found)) {
                  found[n] = [undefined, {}];
                }
                found[n][1][pd] = exact.asset_url;

                continue;
              }
            }

            const nameMatch = candidates.find(x => x.name === n);
            if (nameMatch) {
              // 名前で一致するのがある
              if (isDefined(pd)) {
                if (!(n in found)) {
                  found[n] = [undefined, {}];
                }
                found[n][1][pd] = nameMatch.asset_url;
                // PreferredDomainになければ念のためfetchする
                requiredFetching.push([n, pd] as const);
              } else {
                if (!(n in found)) {
                  found[n] = [undefined, {}];
                }
                found[n][0] = nameMatch.asset_url;
              }

              continue;
            }

            // ない
            if (isDefined(pd)) {
              requiredFetching.push([n, pd] as const);
            }
          }

          const fetchedDomains = Immutable.Set(requiredFetching.map(snd));
          const niResolver = new NodeInfoResolver();
          const fetchedNodeInfoMap = await Promise.all(fetchedDomains.map(d => niResolver.query(d)).toArray());
          const fetchedEmojis = await Promise.all(
            fetchedNodeInfoMap.map(async nodeinfo => {
              switch (detectAPIFamily(nodeinfo)) {
                case "Mastodon":
                  return await getCustomEmojis
                    .send(EmptyRequestBody.instance, ForeignInstance.fromDomainName(nodeinfo.domain))
                    .then(xs =>
                      xs.map(
                        e =>
                          ({
                            name: e.shortcode,
                            domain: nodeinfo.domain,
                            asset_url: e.static_url,
                          } as Omit<RemoteEmoji, "id">)
                      )
                    );
                case "Misskey":
                  return await getInstanceMeta
                    .send(new JsonRequestBody({}), ForeignInstance.fromDomainName(nodeinfo.domain))
                    .then(m =>
                      m.emojis.flatMap(e => [
                        { name: e.id, domain: nodeinfo.domain, asset_url: e.url } as Omit<RemoteEmoji, "id">,
                        ...e.aliases.map(
                          alias =>
                            ({ name: alias, domain: nodeinfo.domain, asset_url: e.url } as Omit<RemoteEmoji, "id">)
                        ),
                      ])
                    );
                case undefined:
                  console.warn("unknown api family", nodeinfo);
                  return [];
              }
            })
          ).then(xs => xs.flat());
          const emojis = await Promise.all(
            fetchedEmojis.map(e =>
              db.remoteEmoji.upsert({
                where: { domain_name: { name: e.name, domain: e.domain } },
                create: e,
                update: { asset_url: e.asset_url },
              })
            )
          );

          // refind
          for (const [n, pd] of requiredFetching) {
            if (isDefined(pd)) {
              const exact = emojis.find(e => e.name === n && e.domain === pd);
              if (exact) {
                // 完全一致で見つかった
                if (!(n in found)) {
                  found[n] = [undefined, {}];
                }
                found[n][1][pd] = exact.asset_url;

                continue;
              }
            }

            const nameMatch = emojis.find(e => e.name === n);
            if (nameMatch) {
              // 名前が一致するのがある
              if (!(n in found)) {
                found[n] = [undefined, {}];
              }
              if (isDefined(pd)) {
                found[n][1][pd] = nameMatch.asset_url;
              } else {
                found[n][0] = nameMatch.asset_url;
              }

              continue;
            }

            // ここまで来ると見つからなかったので諦める
          }

          return found;
        });

        for (const waker of requests.map(snd)) {
          waker(results);
        }
      });
    });
  }
}

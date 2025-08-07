import { createAppLogger } from "@/logger";
import { isDefined } from "@/utils";
import { rethrowWithDescription } from "@/utils/error";
import { fst, snd } from "@/utils/tuple";
import Immutable from "immutable";
import { EmptyRequestBody, ForeignInstance, JsonRequestBody } from "./api";
import { PrismaClient, RemoteEmoji } from "@prisma/client";
import { getCustomEmojis } from "./api/mastodon/instance";
import { getEmojiDetails } from "./api/misskey/meta";
import { NodeInfoResolver, detectAPIFamily } from "./nodeinfo";

export const EmojiPattern = /:([^:\/]+):/g;
export type EmojiNameFragment<N extends string> = `:${N}:`;
export function isEmojiName(input: string): input is EmojiNameFragment<string> {
  return input.startsWith(":") && input.endsWith(":");
}
export function extractEmojiName<N extends string>(input: EmojiNameFragment<N>): N {
  return input.slice(1, -1) as N;
}

export function rewriteHtmlTextEmojis(source: string, emojiToUrlMap: Immutable.Map<string, string>): string {
  return emojiToUrlMap.reduce(
    (c, u, e) => c.replaceAll(`:${e}:`, `<img src="${u}" alt=":${e}:" title=":${e}:">`),
    source
  );
}

export default class EmojiResolver {
  private static readonly Logger = createAppLogger({ name: "EmojiResolver" });

  private readonly db = new PrismaClient();

  async resolveUrl(name: string, preferredDomain?: string): Promise<string | undefined> {
    const results = await this.scheduleRequest(name, preferredDomain).catch(e => {
      EmojiResolver.Logger.error({ error: e, name, preferredDomain }, "Failed to fetch emojis");
      throw e;
    });

    return isDefined(preferredDomain) ? results[name]?.[1]?.[preferredDomain] : results[name]?.[0];
  }

  /**
   * resolves multiple emojis in one time
   *
   * @param names emoji names(excluding leading/trailing colons)
   * @param preferredDomain preferred domain for selecting emojis
   * @returns emoji name to url map, contains only found emojis
   */
  async resolveMultiple(names: string[], preferredDomain?: string): Promise<Immutable.Map<string, string>> {
    const resolved = await Promise.all(
      Immutable.Set(names)
        .map(n => this.resolveUrl(n, preferredDomain).then(url => [n, url] as const))
        .toArray()
    );

    return Immutable.Map(resolved.filter((v): v is [string, string] => isDefined(v[1])));
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
                // PreferredDomainにないので念のためfetchする
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

          const fetchRequestsByDomain = Immutable.List(requiredFetching)
            .groupBy(snd)
            .map(xs => Immutable.Set(xs.map(fst)))
            .toMap();
          const fetchedDomains = fetchRequestsByDomain.keySeq();
          const niResolver = new NodeInfoResolver();
          const fetchedNodeInfoMap = await Promise.all(fetchedDomains.map(d => niResolver.query(d)).toArray());
          const fetchedEmojis = await Promise.all(
            fetchedNodeInfoMap.map(async nodeinfo => {
              switch (detectAPIFamily(nodeinfo)) {
                case "Mastodon":
                case "Mastodon/Fedibird":
                  // Note: これは全部取るしかない
                  return await getCustomEmojis
                    .send(EmptyRequestBody.instance, ForeignInstance.fromDomainName(nodeinfo.domain))
                    .then(
                      xs =>
                        xs.map(
                          e =>
                            ({
                              name: e.shortcode,
                              domain: nodeinfo.domain,
                              asset_url: e.static_url,
                            } as Omit<RemoteEmoji, "id">)
                        ),
                      rethrowWithDescription(() => `Failed to fetch custom emojis for ${nodeinfo.domain}`)
                    );
                case "Misskey":
                  // Note: こっちは個別に取れる
                  return await Promise.allSettled(
                    fetchRequestsByDomain
                      .get(nodeinfo.domain, Immutable.Set<string>())
                      .map(e =>
                        getEmojiDetails.send(
                          new JsonRequestBody({ name: e }),
                          ForeignInstance.fromDomainName(nodeinfo.domain)
                        )
                      )
                      .toArray()
                  ).then(xs =>
                    xs.flatMap(res => {
                      switch (res.status) {
                        case "fulfilled":
                          return [
                            { name: res.value.name, domain: nodeinfo.domain, asset_url: res.value.url } as Omit<
                              RemoteEmoji,
                              "id"
                            >,
                            ...(res.value.aliases ?? []).map(
                              alias =>
                                ({ name: alias, domain: nodeinfo.domain, asset_url: res.value.url } as Omit<
                                  RemoteEmoji,
                                  "id"
                                >)
                            ),
                          ];
                        case "rejected":
                          EmojiResolver.Logger.error(
                            { reason: res.reason, domain: nodeinfo.domain },
                            "Error in fetching emojis"
                          );
                          return [];
                      }
                    })
                  );
                case undefined:
                  EmojiResolver.Logger.warn({ nodeinfo, domain: nodeinfo.domain }, "unknown api family");
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

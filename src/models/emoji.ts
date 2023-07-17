import { isDefined } from "@/utils";
import { snd } from "@/utils/tuple";
import { PrismaClient, RemoteEmoji } from "@prisma/client";
import Immutable from "immutable";
import { EmptyRequestBody, ForeignInstance, JsonRequestBody, RemoteInstance } from "./api";
import { getCustomEmojis } from "./api/mastodon/instance";
import { Status } from "./api/mastodon/status";
import { getEmojiDetails } from "./api/misskey/meta";
import { NodeInfoResolver, detectAPIFamily } from "./nodeinfo";
import Webfinger from "./webfinger";

const EmojiPattern = /:([^:\/]+):/g;

export default class EmojiResolver {
  private readonly db = new PrismaClient();

  async resolveUrl(name: string, preferredDomain?: string): Promise<string | undefined> {
    const results = await this.scheduleRequest(name, preferredDomain);
    return isDefined(preferredDomain) ? results[name]?.[1]?.[preferredDomain] : results[name]?.[0];
  }

  async resolveMultiple(names: string[], preferredDomain?: string): Promise<Immutable.Map<string, string>> {
    const resolved = await Promise.all(
      Immutable.Set(names)
        .map(n => this.resolveUrl(n, preferredDomain).then(url => [n, url] as const))
        .toArray()
    );

    return Immutable.Map(resolved.filter((v): v is [string, string] => isDefined(v[1])));
  }

  async resolveAllInStatus(status: Status, instance: RemoteInstance): Promise<Status> {
    const captures = [...status.content.matchAll(EmojiPattern)];
    const emojiReplacements = captures.map(c => ({ emojiName: c[1], startAt: c.index ?? 1 }));

    const preferredDomain = (await Webfinger.Address.decompose(status.account.acct).resolveDomainPart(instance)).domain;
    const resolvedEmojis = await this.resolveMultiple(
      emojiReplacements.map(({ emojiName }) => emojiName),
      preferredDomain
    );
    console.log(status.content, resolvedEmojis.toObject(), emojiReplacements);

    const newContent = emojiReplacements
      .filter(e => resolvedEmojis.has(e.emojiName))
      .map(e => [e.emojiName, resolvedEmojis.get(e.emojiName)!!])
      .reduce((c, [e, u]) => c.replaceAll(`:${e}:`, `<img src="${u}" alt=":${e}:">`), status.content);

    return { ...status, content: newContent };
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
            .groupBy(v => v[1])
            .map(xs => Immutable.Set(xs.map(x => x[0])))
            .toMap();
          const fetchedDomains = fetchRequestsByDomain.keySeq();
          const niResolver = new NodeInfoResolver();
          const fetchedNodeInfoMap = await Promise.all(fetchedDomains.map(d => niResolver.query(d)).toArray());
          const fetchedEmojis = await Promise.all(
            fetchedNodeInfoMap.map(async nodeinfo => {
              switch (detectAPIFamily(nodeinfo)) {
                case "Mastodon":
                  // Note: これは全部取るしかない
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
                          // TODO: あとでLoggerつくる
                          console.error(res.reason);
                          return [];
                      }
                    })
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

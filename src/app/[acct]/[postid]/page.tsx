import BackLinkRow from "@/components/BackLinkRow";
import Header from "@/components/Header";
import ProdInstance from "@/models/api";
import { getInstanceData } from "@/models/api/mastodon/instance";
import { getStatus, isRemoteAccount } from "@/models/api/mastodon/status";
import singleCardStyle from "@/styles/components/singleCard.module.scss";
import Link from "next/link";

async function getPost(acct: string, postid: string) {
  const instance = new ProdInstance();
  const status = await getStatus(postid).send(instance);
  const full_account_path = isRemoteAccount(status.account)
    ? status.account.acct
    : await getInstanceData.send(instance).then((x) => `${status.account.username}@${x.domain}`);

  return { status, full_account_path };
}

export default async function SinglePostPage({
  params,
}: {
  readonly params: { readonly acct: string; readonly postid: string };
}) {
  const { status, full_account_path } = await getPost(
    decodeURIComponent(params.acct),
    decodeURIComponent(params.postid)
  );

  return (
    <>
      <Header />
      <main>
        <BackLinkRow />
        <article className={singleCardStyle.singleCard}>
          <img src={status.account.avatar} />
          <h1>{status.account.display_name}</h1>
          <h2>
            <Link href={`/@${status.account.acct}`}>@{full_account_path}</Link>
          </h2>
          <div className={singleCardStyle.content} dangerouslySetInnerHTML={{ __html: status.content }} />
        </article>
      </main>
    </>
  );
}

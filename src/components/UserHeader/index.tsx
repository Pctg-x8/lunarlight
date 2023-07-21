import { Account } from "@/models/account";
import { transformDisplayNameTags } from "../domTransformer/emoji";
import styles from "./styles.module.scss";

export default function UserHeader({ account, fullAcct }: { readonly account: Account; readonly fullAcct: string }) {
  const { posts, followers, followings } = account.counters;

  return (
    <article className={styles.userHeader}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.headerImage} src={account.headerUrl} alt={fullAcct} />
      <article className={styles.baseInfoGrid}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={account.avatarUrl} alt={fullAcct} />
        <h1>{transformDisplayNameTags(account)}</h1>
        <h2>@{fullAcct}</h2>
      </article>
      <div className={styles.note} dangerouslySetInnerHTML={{ __html: account.note }} />
      <ul className={styles.numbers}>
        <li>
          <em>{posts}</em> 投稿
        </li>
        <li>
          <em>{followings}</em> フォロー
        </li>
        <li>
          <em>{followers}</em> フォロワー
        </li>
      </ul>
      <ul className={styles.fieldList}>
        {account.fields.map((m, x) => (
          <li key={x}>
            <h1>{m.name}</h1>
            <div dangerouslySetInnerHTML={{ __html: m.value }} />
          </li>
        ))}
      </ul>
    </article>
  );
}

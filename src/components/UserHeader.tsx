import { Account } from "@/models/api/mastodon/account";
import styles from "@/styles/components/UserHeader.module.scss";

export default function UserHeader({ account, fullAcct }: { readonly account: Account; readonly fullAcct: string }) {
  return (
    <article>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.headerImage} src={account.header} alt={fullAcct} />
      <article className={styles.baseInfoGrid}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={account.avatar} alt={fullAcct} />
        <h1>{account.display_name}</h1>
        <h2>@{fullAcct}</h2>
      </article>
      <div className={styles.note} dangerouslySetInnerHTML={{ __html: account.note }} />
      <ul className={styles.numbers}>
        <li>
          <em>{account.statuses_count}</em> 投稿
        </li>
        <li>
          <em>{account.following_count}</em> フォロー
        </li>
        <li>
          <em>{account.followers_count}</em> フォロワー
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

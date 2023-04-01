import { CredentialAccount } from "@/models/api/mastodon/account";
import LoginStatus from "../LoginStatus";
import styles from "./styles.module.scss";

export default function Header({ login }: { readonly login: CredentialAccount | null }) {
  return (
    <header className={styles.appHeader}>
      <section className={styles.appname}>
        <h1>
          Lunarlight{" "}
          <small>
            for{" "}
            <a className="non-colored" href="https://crescent.ct2.io/ll">
              crescent
            </a>
          </small>
        </h1>
        <h2>BETA</h2>
      </section>
      <div className={styles.spacer} />
      <section className={styles.loginStatus}>
        <LoginStatus login={login} />
      </section>
    </header>
  );
}

import { getAuthorizedAccountSSR } from "@/models/auth";
import { Suspense } from "react";
import LoginStatus from "../LoginStatus";
import styles from "./styles.module.scss";

export default function Header() {
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
        <Suspense>
          <LoginAccountArea />
        </Suspense>
      </section>
    </header>
  );
}

async function LoginAccountArea() {
  const login = await getAuthorizedAccountSSR();

  return <LoginStatus login={login} />;
}

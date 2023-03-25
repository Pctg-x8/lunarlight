import { Suspense } from "react";
import LoginStatus from "../LoginStatus";
import styles from "./styles.module.scss";

export default function Header() {
  return (
    <header className={styles.appHeader}>
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
      <div className={styles.spacer} />
      <section className={styles.loginStatus}>
        <Suspense>
          <LoginStatus />
        </Suspense>
      </section>
    </header>
  );
}

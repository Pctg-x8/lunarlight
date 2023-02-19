import styles from "@/styles/components/Header.module.scss";

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <h1>
        Lunarlight <small>for crescent</small>
      </h1>
      <h2>BETA</h2>
    </header>
  );
}

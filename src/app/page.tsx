import styles from "@/styles/Home.module.css";
import { Metadata } from "next";

export const metadata = { title: { default: "Lunarlight", template: "%s - Lunarlight" } } satisfies Metadata;

export default function Home() {
  return (
    <>
      <main className={styles.main}></main>
    </>
  );
}

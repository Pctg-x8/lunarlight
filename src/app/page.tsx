import styles from "@/styles/Home.module.css";
import { Inter } from "@next/font/google";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: { default: "Lunarlight", template: "%s - Lunarlight" } } satisfies Metadata;

export default function Home() {
  return (
    <>
      <main className={styles.main}></main>
    </>
  );
}

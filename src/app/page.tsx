import Header from "@/components/Header";
import styles from "@/styles/Home.module.css";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "Lunarlight" };

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}></main>
    </>
  );
}

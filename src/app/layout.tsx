import Header from "@/components/Header";
import { getAuthorizedUserServerProps } from "@/models/auth";
import "@/styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Metadata } from "next";
import React from "react";

config.autoAddCss = false;

export const metadata = { title: { default: "Lunarlight", template: "%s - Lunarlight" } } satisfies Metadata;

export default async function App({ children }: { readonly children: React.ReactNode }) {
  const { account } = await getAuthorizedUserServerProps();

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <Header login={account} />
        <main>{children}</main>
      </body>
    </html>
  );
}

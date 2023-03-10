import Header from "@/components/Header";
import "@/styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Metadata } from "next";
import React from "react";

config.autoAddCss = false;

export const metadata = { title: { default: "Lunarlight", template: "%s - Lunarlight" } } satisfies Metadata;

export default function App({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

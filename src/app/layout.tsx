import Header from "@/components/Header";
import "@/styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import React from "react";

config.autoAddCss = false;

export default function App({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

import Header from "@/components/Header";
import LoginAccountMenu from "@/components/Header/LoginAccountMenu";
import LoginButton from "@/components/Header/LoginButton";
import { getAuthorizedAccountSSR } from "@/models/auth";
import "./globals.css";
import { isDefined } from "@/utils";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Metadata } from "next";
import React from "react";

config.autoAddCss = false;

export const metadata: Metadata = { title: { default: "Lunarlight", template: "%s - Lunarlight" } };

export default async function App({ children }: { readonly children: React.ReactNode }) {
  const currentUser = await getAuthorizedAccountSSR();

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <Header
          currentUserView={isDefined(currentUser) ? <LoginAccountMenu account={currentUser} /> : <LoginButton />}
        />
        {children}
      </body>
    </html>
  );
}

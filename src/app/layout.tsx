import BottomMenu from "@/components/BottomMenu";
import ClientPreferencesProvider from "@/components/ClientPreferencesProvider";
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";
import "@/styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { css } from "@styled-system/css";
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
        <div className={ContentWrapper}>
          <SideMenu />
          <ClientPreferencesProvider>{children}</ClientPreferencesProvider>
          <section className={RightContent} />
        </div>
        <BottomMenu />
      </body>
    </html>
  );
}

const ContentWrapper = css({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  "& > nav": {
    position: "sticky",
    // なぞの1px(これがないとずれる)
    // TODO: でもまあこれでも環境によってはずれてるので、そのうち正しく計算式出したい
    top: "calc(16px + 16px + 20px + 1px + 1px + 8px)",
    width: "60px",
    flex: "0 0 60px",
    display: "none",
    lg: {
      width: "320px",
      flex: "0 0 320px",
      top: "calc(16px + 16px + 20px + 1px + 1px)",
    },
    sm: {
      display: "initial",
    },
  },
});

const RightContent = css({
  width: "320px",
  flex: "0 0 320px",
  display: "none",
  lgr: {
    display: "initial",
  },
});

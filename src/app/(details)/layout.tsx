import BottomMenu from "@/components/BottomMenu";
import ClientPreferencesProvider from "@/components/ClientPreferencesProvider";
import SideMenu from "@/components/SideMenu";
import "@/styles/globals.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { css } from "@styled-system/css";
import React from "react";

export default function DetailsLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <>
      <div className={ContentWrapper}>
        <SideMenu />
        <main>
          <ClientPreferencesProvider>{children}</ClientPreferencesProvider>
        </main>
      </div>
      <BottomMenu />
    </>
  );
}

const ContentWrapper = css({
  maxWidth: "content.maxWidth",
  width: "100%",
  mx: "auto",
  sm: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
  },
  "& > nav": {
    position: "sticky",
    // なぞの1px(これがないとずれる)
    // TODO: でもまあこれでも環境によってはずれてるので、そのうち正しく計算式出したい
    top: { base: "calc(16px + 16px + 20px + 1px + 1px + 8px)", lg: "calc(16px + 16px + 20px + 1px + 1px)" },
    width: { base: "60px", lg: "320px" },
  },
  "& > main": {
    mb: { base: "calc(16px + 14px + 1rem + 16px)", sm: "0" },
  },
});

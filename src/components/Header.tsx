"use client";

import { css } from "@styled-system/css";
import { ReactNode } from "react";
import AppName from "./Header/AppName";

export default function Header({ currentUserView }: { readonly currentUserView: ReactNode }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={AppHeader} onClick={scrollToTop}>
      <AppName />
      <div className={Spacer} />
      <section className={LoginStatusArea}>{currentUserView}</section>
    </header>
  );
}

const AppHeader = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  boxShadow: "0px 0px 8px var(--shadow-color)",
  boxShadowColor: "appheader.bottom",
  borderBottom: "solid 1px",
  borderBottomColor: "appheader.bottom",
  position: "sticky",
  top: "0px",
  background: "appheader.background",
  zIndex: 1,
  backdropFilter: "blur(8px)",
});

const Spacer = css({ flex: "1" });

const LoginStatusArea = css({ margin: "8px" });

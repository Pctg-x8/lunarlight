"use client";

import { css } from "@styled-system/css";
import { ReactNode } from "react";

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

function AppName() {
  return (
    <section className={StyledAppName}>
      <h1>
        Lunarlight{" "}
        <small>
          for{" "}
          <a className="non-colored" href="https://crescent.ct2.io/ll">
            crescent
          </a>
        </small>
      </h1>
      <h2>BETA</h2>
    </section>
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

const StyledAppName = css({
  margin: "16px",
  display: "flex",
  flexDirection: "row",
  alignItems: "baseline",
  "& > h1": {
    marginRight: "8px",
    fontSize: "20px",
    fontWeight: "bolder",
    letterSpacing: "0.5px",
    "& > small": {
      fontSize: "14px",
      fontWeight: "normal",
      opacity: "0.75",
      letterSpacing: "0",
      "& > a": {
        color: "inherit",
        _after: {
          background: "app.text",
        },
      },
    },
  },
  "& > h2": {
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "8px",
    fontWeight: "normal",
    background: "label.normal.background",
    color: "label.normal.text",
  },
});

const Spacer = css({ flex: "1" });

const LoginStatusArea = css({ margin: "8px" });

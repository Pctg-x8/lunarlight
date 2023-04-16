import { BREAKPOINT_BOTTOM_MENU } from "@/breakpoints";
import BottomMenu from "@/components/BottomMenu";
import Header from "@/components/Header";
import { getAuthorizedAccountSSR } from "@/models/auth";
import "@/styles/globals.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { styled } from "@linaria/react";
import { Metadata } from "next";
import React from "react";

config.autoAddCss = false;

export const metadata = { title: { default: "Lunarlight", template: "%s - Lunarlight" } } satisfies Metadata;

export default async function App({ children }: { readonly children: React.ReactNode }) {
  const login = await getAuthorizedAccountSSR();

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <Body>
        <Header login={login} />
        {children}
        <BottomMenu />
      </Body>
    </html>
  );
}

const Body = styled.body`
  & > footer {
    position: fixed;
    bottom: 0;

    @media (min-width: ${BREAKPOINT_BOTTOM_MENU}) {
      display: none;
    }
  }
`;

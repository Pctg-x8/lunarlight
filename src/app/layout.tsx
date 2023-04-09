import { BREAKPOINT_BOTTOM_MENU } from "@/breakpoints";
import BottomMenu from "@/components/BottomMenu";
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";
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
        <ContentWrapper>
          <SideMenu />
          {children}
          <section className="right" />
        </ContentWrapper>
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

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > nav {
    position: sticky;
    top: calc(16px + 16px + 20px + 1px + 1px); // なぞの1px(これがないとずれる)
    width: 320px;
    flex: 0 0 320px;

    @media (max-width: calc(800px + 320px)) {
      width: 60px;
      flex: 0 0 60px;
    }

    @media (max-width: ${BREAKPOINT_BOTTOM_MENU}) {
      display: none;
    }
  }

  & > .right {
    width: 320px;
    flex: 0 0 320px;

    @media (max-width: calc(800px + 320px + 320px)) {
      display: none;
    }
  }
`;

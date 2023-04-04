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
      <body>
        <Header login={login} />
        <ContentWrapper>
          <SideMenu />
          <main>{children}</main>
          <section className="right" />
        </ContentWrapper>
      </body>
    </html>
  );
}

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > nav {
    position: sticky;
    top: calc(16px + 16px + 20px + 1px + 1px); // なぞの1px(これがないとずれる)
    height: fit-content;
    width: 320px;
    flex: 0 0 320px;
  }

  & > .right {
    width: 320px;
    flex: 0 0 320px;
  }
`;

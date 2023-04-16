"use client";

import { BREAKPOINT_BOTTOM_MENU } from "@/breakpoints";
import LocalPreferences from "@/models/localPreferences";
import { styled } from "@linaria/react";
import HomeStreamingTimeline from "./HomeStreamingTimeline";
import SideMenu from "./SideMenu";

export default function MainPage({ hasLoggedIn }: { readonly hasLoggedIn: boolean }): JSX.Element {
  const timelineMode = LocalPreferences.TIMELINE_MODE.load();

  if (!hasLoggedIn) return <p></p>;

  if (timelineMode === "normal") {
    return (
      <ContentWrapper>
        <SideMenu />
        <LimitedFrame>
          <HomeStreamingTimeline mode={timelineMode} />
        </LimitedFrame>
        <div className="right" />
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <SideMenu />
      <Frame>
        <HomeStreamingTimeline mode={timelineMode} />
      </Frame>
    </ContentWrapper>
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
    flex-grow: 0;
    flex-shrink: 0;

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

const LimitedFrame = styled.main`
  max-width: var(--single-max-width);
  width: 100%;

  @media (max-width: ${BREAKPOINT_BOTTOM_MENU}) {
    margin-bottom: calc(16px + 14px + 1rem + 16px);
  }
`;

const Frame = styled.main`
  width: 100%;

  @media (max-width: ${BREAKPOINT_BOTTOM_MENU}) {
    margin-bottom: calc(16px + 14px + 1rem + 16px);
  }
`;

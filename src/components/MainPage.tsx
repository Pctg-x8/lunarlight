"use client";

import { BREAKPOINT_BOTTOM_MENU } from "@/breakpoints";
import LocalPreferences from "@/models/localPreferences";
import { styled } from "@linaria/react";
import HomeStreamingTimeline from "./HomeStreamingTimeline";

export default function MainPage({ hasLoggedIn }: { readonly hasLoggedIn: boolean }): JSX.Element {
  const timelineMode = LocalPreferences.TIMELINE_MODE.load();

  if (!hasLoggedIn) return <p></p>;

  if (timelineMode === "normal") {
    return (
      <LimitedFrame>
        <HomeStreamingTimeline mode={timelineMode} />
      </LimitedFrame>
    );
  }

  return (
    <Frame>
      <HomeStreamingTimeline mode={timelineMode} />
    </Frame>
  );
}

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

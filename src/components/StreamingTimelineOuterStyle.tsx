"use client";

import { BREAKPOINT_BOTTOM_MENU } from "@/breakpoints";
import { styled } from "@linaria/react";
import { ReactNode, useContext } from "react";
import { ClientPreferencesContext } from "./ClientPreferencesProvider";

export default function StreamingTimelineOuterStyle({ children }: { readonly children: ReactNode }): JSX.Element {
  const { timelineMode } = useContext(ClientPreferencesContext);

  switch (timelineMode) {
    case "normal":
      return <LimitedFrame>{children}</LimitedFrame>;
    case "expert":
      return <Frame>{children}</Frame>;
  }
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

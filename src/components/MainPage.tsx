"use client";

import LocalPreferences from "@/models/localPreferences";
import { styled } from "@linaria/react";
import HomeStreamingTimeline from "./HomeStreamingTimeline";

export default function MainPage({ hasLoggedIn }: { readonly hasLoggedIn: boolean }): JSX.Element {
  const timelineMode = LocalPreferences.TIMELINE_MODE.load();

  if (!hasLoggedIn) return <p></p>;

  return (
    <Frame limited={timelineMode === "normal"}>
      <HomeStreamingTimeline mode={timelineMode} />
    </Frame>
  );
}

const Frame = styled.main<{ readonly limited?: boolean }>`
  max-width: ${(props) => (props.limited ? "var(--single-max-width)" : "unset")};
  margin-left: auto;
  margin-right: auto;
`;

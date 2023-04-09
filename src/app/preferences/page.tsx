import TimelineModePreferences from "@/components/Preferences/TimelineMode";
import { styled } from "@linaria/react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Preferences" };

export default function PreferencesPage(): JSX.Element {
  return (
    <Frame>
      <TimelineModePreferences />
    </Frame>
  );
}

const Frame = styled.main`
  max-width: var(--single-max-width);
  width: 100%;
`;

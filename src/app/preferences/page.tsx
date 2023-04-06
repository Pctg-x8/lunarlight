import TimelineModePreferences from "@/components/Preferences/TimelineMode";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Preferences" };

export default function PreferencesPage(): JSX.Element {
  return (
    <>
      <TimelineModePreferences />
    </>
  );
}

import TimelineModePreferences from "@/components/Preferences/TimelineMode";
import { css } from "@styled-system/css";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Preferences" };

export default function PreferencesPage(): JSX.Element {
  return (
    <main className={Framed}>
      <TimelineModePreferences />
    </main>
  );
}

const Framed = css({
  maxWidth: "content.maxWidth",
  width: "100%",
});

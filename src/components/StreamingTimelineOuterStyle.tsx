"use client";

import { css, cx } from "@styled-system/css";
import { ReactNode, useContext } from "react";
import { ClientPreferencesContext } from "./ClientPreferencesProvider";

export default function StreamingTimelineOuterStyle({ children }: { readonly children: ReactNode }): JSX.Element {
  const { timelineMode } = useContext(ClientPreferencesContext);

  return <main className={cx(timelineMode == "expert" ? LimitedFrame : Frame, BottomMenuSpacer)}>{children}</main>;
}

const BottomMenuSpacer = css({
  marginBottom: "calc(16px + 14px + 1rem + 16px)",
  sm: {
    marginBottom: "0",
  },
});
const LimitedFrame = css({
  maxWidth: "content.maxWidth",
  width: "100%",
});
const Frame = css({
  width: "100%",
});

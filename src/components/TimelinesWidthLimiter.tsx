"use client";

import LocalPreferences from "@/models/localPreferences";
import { css } from "@styled-system/css";
import { PropsWithChildren, useLayoutEffect, useRef } from "react";

export default function TimelinesWidthLimiter({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineMode = LocalPreferences.TIMELINE_MODE.useReactiveValue();

  // reflect style by timeline mode(that available only in client)
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.className = timelineMode === "expert" ? UnlimitedContainerStyle : LimitedContainerStyle;
  }, [timelineMode]);

  return <div ref={containerRef}>{children}</div>;
}

const UnlimitedContainerStyle = css({
  width: "100%",
});

const LimitedContainerStyle = css({
  width: "100%",
  maxWidth: "content.maxWidth",
  mx: "auto",
});

"use client";

import { realPath } from "@/utils/paths";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@styled-system/css";
import { styled } from "@styled-system/jsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function MenuItem({
  icon,
  href,
  children,
}: React.PropsWithChildren<{
  readonly icon: IconProp;
  readonly href: string;
}>) {
  const currentPath = usePathname();

  return (
    <Link href={href} className={LinkStyle} data-active={currentPath === realPath(href)}>
      <FontAwesomeIcon icon={icon} className={Icon} />
      {children}
    </Link>
  );
}

const LinkStyle = css({
  display: "block",
  p: { base: "12px 0", lg: "16px" },
  transition: "background 0.1s ease, color 0.1s ease",
  bg: { base: "rgb(255 255 255 / 0%)", _hover: "rgb(255 255 255 / 5%)" },
  color: { base: "app.subtext", _hover: "app.text", _customActive: "menu.activeLink !important" },
  textAlign: { base: "center", lg: "start" },
  ml: 0,
  mr: 0,
  fontSize: "1rem",
});

const Icon = css({
  "--fa-display": { base: "block", lg: "inline" },
  mr: { base: "auto", lg: "8px" },
  ml: { base: "auto", lg: 0 },
  mb: { base: "4px", lg: 0 },
});

const ShortLabel = styled("span", {
  base: {
    display: { base: "initial", lg: "none" },
  },
});
const FullLabel = styled("span", {
  base: {
    display: { base: "none", lg: "initial" },
  },
});

export const MenuShortLabel = ShortLabel;
export const MenuFullLabel = FullLabel;
// MenuItem.ShortLabel = ShortLabel;
// MenuItem.FullLabel = FullLabel;

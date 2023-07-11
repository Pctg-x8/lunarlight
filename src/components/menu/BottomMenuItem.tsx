import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@styled-system/css";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function BottomMenuItem({
  icon,
  href,
  active,
  children,
}: PropsWithChildren<{ readonly icon: IconProp; readonly href: string; readonly active: boolean }>) {
  return (
    <Link href={href} data-active={active} className={LinkStyle}>
      <FontAwesomeIcon icon={icon} className={IconStyle} />
      {children}
    </Link>
  );
}

const LinkStyle = css({
  display: "block",
  p: "12px 0",
  textAlign: "center",
  transition: "background 0.1s ease, color 0.1s ease",
  bg: { base: "rgb(255 255 255 / 0%)", _hover: "rgb(255 255 255 / 5%)" },
  color: { base: "app.subtext", _hover: "app.text", _customActive: "menu.activeLink !important" },
  fontSize: "1rem",
});

const IconStyle = css({
  "--fa-display": "block",
  ml: "auto",
  mr: "auto",
  mb: "4px",
});

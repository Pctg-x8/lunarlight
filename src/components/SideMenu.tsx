"use client";

import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@styled-system/css";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Note: FontAwesomeのスタイリングがPanda CSSより優先されるのでdivで囲わないといけない（つらい）

export default function SideMenu(): JSX.Element {
  const path = usePathname();

  return (
    <nav className={Frame}>
      <ul>
        <li>
          <Link href="/" className={`no-default`} data-active={path === "/"}>
            <div className={Icon}>
              <FontAwesomeIcon icon={faHouseChimney} />
            </div>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/public" className={`no-default`} data-active={path === "/public"}>
            <div className={Icon}>
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <span>Public</span>
          </Link>
        </li>
        <li>
          <Link href="/preferences" className={`no-default`} data-active={path === "/preferences"}>
            <div className={Icon}>
              <FontAwesomeIcon icon={faGear} />
            </div>
            <span className={FullLabel}>Preferences</span>
            <span className={ShortLabel}>Prefs</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

const ShortLabel = css({
  display: "initial",
  lg: {
    display: "none",
  },
});
const FullLabel = css({
  display: "none",
  lg: {
    display: "initial",
  },
});

const Icon = css({
  display: "block",
  marginRight: "auto",
  marginLeft: "auto",
  lg: {
    display: "inline",
    marginRight: "16px",
    marginLeft: 0,
  },
});

const Frame = css({
  height: "fit-content",
  background: "menu.background",
  "& > ul > li > a": {
    display: "block",
    padding: "8px 0",
    transition: "background 0.1s ease",
    background: "rgb(255 255 255 / 0%)",
    color: "app.subtext",
    textAlign: "center",
    marginLeft: 0,
    marginRight: 0,
    _hover: {
      background: "rgb(255 255 255 / 5%)",
      color: "app.text",
    },
    '&[data-active="true"]': {
      color: "menu.activeLink !important",
    },
    lg: {
      textAlign: "start",
      padding: "16px",
      "& > span": {
        fontSize: "1rem",
      },
    },
  },
});

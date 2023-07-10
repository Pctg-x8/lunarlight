"use client";

import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@styled-system/css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomMenu(): JSX.Element {
  const pathname = usePathname();

  return (
    <footer className={Frame}>
      <ul>
        <li>
          <Link href="/" className={`no-default`} data-active={pathname === "/"}>
            <FontAwesomeIcon icon={faHouseChimney} />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/public" className={`no-default`} data-active={pathname === "/public"}>
            <FontAwesomeIcon icon={faGlobe} />
            <span>Public</span>
          </Link>
        </li>
        <li>
          <Link href="/preferences" className={`no-default`} data-active={pathname === "/preferences"}>
            <FontAwesomeIcon icon={faGear} className="icon" />
            <span>Preferences</span>
          </Link>
        </li>
      </ul>
    </footer>
  );
}

const Frame = css({
  width: "100%",
  background: "menu.background",
  "& > ul": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "stretch",
    "& > li": {
      flex: 1,
      "& > a": {
        display: "block",
        padding: "18px",
        textAlign: "center",
        transition: "background 0.1s ease",
        background: "rgb(255 255 255 / 0%)",
        color: "app.subtext",
        "& > svg": {
          "--fa-display": "block",
          marginLeft: "auto",
          marginRight: "auto",
        },
        "& > span": {
          fontSize: "1rem",
        },
        _hover: {
          background: "rgb(255 255 255 / 5%)",
          color: "app.text",
        },
        '&[data-active="true"]': {
          color: "menu.activeLink !important",
        },
      },
    },
  },
  position: "fixed",
  bottom: 0,
  sm: {
    display: "none",
  },
});

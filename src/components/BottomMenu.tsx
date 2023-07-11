"use client";

import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { css } from "@styled-system/css";
import { usePathname } from "next/navigation";
import BottomMenuItem from "./menu/BottomMenuItem";

export default function BottomMenu(): JSX.Element {
  const pathname = usePathname();

  return (
    <footer className={Frame}>
      <ul>
        <li>
          <BottomMenuItem href="/" active={pathname === "/"} icon={faHouseChimney}>
            Home
          </BottomMenuItem>
        </li>
        <li>
          <BottomMenuItem href="/public" active={pathname === "/public"} icon={faGlobe}>
            Public
          </BottomMenuItem>
        </li>
        <li>
          <BottomMenuItem href="/preferences" active={pathname === "/preferences"} icon={faGear}>
            Prefs
          </BottomMenuItem>
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
    },
  },
  position: "fixed",
  bottom: 0,
  display: { base: "initial", sm: "none" },
});

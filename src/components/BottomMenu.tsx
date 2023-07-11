"use client";

import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { css } from "@styled-system/css";
import { usePathname } from "next/navigation";
import SideMenuItem from "./menu/MenuItem";

export default function BottomMenu(): JSX.Element {
  const pathname = usePathname();

  return (
    <footer className={Frame}>
      <ul>
        <li>
          <SideMenuItem href="/" active={pathname === "/"} icon={faHouseChimney}>
            Home
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem href="/public" active={pathname === "/public"} icon={faGlobe}>
            Public
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem href="/preferences" active={pathname === "/preferences"} icon={faGear}>
            Prefs
          </SideMenuItem>
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

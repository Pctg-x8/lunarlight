"use client";

import { realPath } from "@/utils/paths";
import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { css } from "@styled-system/css";
import { usePathname } from "next/navigation";
import MenuItem from "./menu/MenuItem";

export default function BottomMenu(): JSX.Element {
  const pathname = usePathname();

  return (
    <footer className={Frame}>
      <ul>
        <li>
          <MenuItem href="/" active={pathname === realPath("/")} icon={faHouseChimney}>
            Home
          </MenuItem>
        </li>
        <li>
          <MenuItem href="/public" active={pathname === realPath("/public")} icon={faGlobe}>
            Public
          </MenuItem>
        </li>
        <li>
          <MenuItem href="/preferences" active={pathname === realPath("/preferences")} icon={faGear}>
            Prefs
          </MenuItem>
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
  display: { sm: "none" },
});

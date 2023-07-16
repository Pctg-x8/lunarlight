"use client";

import { realPath } from "@/utils/paths";
import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { css } from "@styled-system/css";
import { usePathname } from "next/navigation";
import MenuItem from "./menu/MenuItem";

export default function SideMenu(): JSX.Element {
  const path = usePathname();

  return (
    <nav className={Frame}>
      <ul>
        <li>
          <MenuItem href="/" icon={faHouseChimney} active={path === realPath("/")}>
            Home
          </MenuItem>
        </li>
        <li>
          <MenuItem href="/public" icon={faGlobe} active={path === realPath("/public")}>
            Public
          </MenuItem>
        </li>
        <li>
          <MenuItem href="/preferences" icon={faGear} active={path === realPath("/preferences")}>
            <MenuItem.FullLabel>Preferences</MenuItem.FullLabel>
            <MenuItem.ShortLabel>Prefs</MenuItem.ShortLabel>
          </MenuItem>
        </li>
      </ul>
    </nav>
  );
}

const Frame = css({
  height: "fit-content",
  background: "menu.background",
  display: { base: "none", sm: "initial" },
});

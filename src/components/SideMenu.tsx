"use client";

import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { css } from "@styled-system/css";
import { usePathname } from "next/navigation";
import SideMenuItem from "./menu/MenuItem";

// Note: FontAwesomeのスタイリングがPanda CSSより優先されるのでdivで囲わないといけない（つらい）

export default function SideMenu(): JSX.Element {
  const path = usePathname();

  return (
    <nav className={Frame}>
      <ul>
        <li>
          <SideMenuItem href="/" icon={faHouseChimney} active={path === "/"}>
            Home
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem href="/public" icon={faGlobe} active={path === "/public"}>
            Public
          </SideMenuItem>
        </li>
        <li>
          <SideMenuItem href="/preferences" icon={faGear} active={path === "/preferences"}>
            <SideMenuItem.FullLabel>Preferences</SideMenuItem.FullLabel>
            <SideMenuItem.ShortLabel>Prefs</SideMenuItem.ShortLabel>
          </SideMenuItem>
        </li>
      </ul>
    </nav>
  );
}

const Frame = css({
  height: "fit-content",
  background: "menu.background",
});

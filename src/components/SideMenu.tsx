import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { css } from "@styled-system/css";
import MenuItem, { MenuShortLabel, MenuFullLabel } from "./SideMenu/MenuItem";

export default function SideMenu() {
  return (
    <nav className={Frame}>
      <ul>
        <li>
          <MenuItem href="/" icon={faHouseChimney}>
            Home
          </MenuItem>
        </li>
        <li>
          <MenuItem href="/public" icon={faGlobe}>
            Public
          </MenuItem>
        </li>
        <li>
          <MenuItem href="/preferences" icon={faGear}>
            <MenuFullLabel>Preferences</MenuFullLabel>
            <MenuShortLabel>Prefs</MenuShortLabel>
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

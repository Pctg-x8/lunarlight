import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { css } from "@styled-system/css";
import MenuItem from "./SideMenu/MenuItem";

export default function BottomMenu() {
  return (
    <footer className={Frame}>
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

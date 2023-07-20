import { css } from "@styled-system/css";
import Link from "next/link";

export default function AppName() {
  return (
    <section className={StyledAppName}>
      <h1>
        Lunarlight{" "}
        <small>
          for{" "}
          <Link className={LinkStyle} href="https://crescent.ct2.io/ll">
            crescent
          </Link>
        </small>
      </h1>
      <h2 className={BetaLabel}>BETA</h2>
    </section>
  );
}

const StyledAppName = css({
  margin: "16px",
  display: "flex",
  flexDirection: "row",
  alignItems: "baseline",
  "& > h1": {
    marginRight: "8px",
    fontSize: "20px",
    fontWeight: "bolder",
    letterSpacing: "0.5px",
    "& > small": {
      fontSize: "14px",
      fontWeight: "normal",
      opacity: "0.75",
      letterSpacing: "0",
      "& > a": {
        color: "inherit",
        _after: {
          background: "app.text",
        },
      },
    },
  },
});
const LinkStyle = css({
  "--text-color": { base: "colors.app.subtext", _hover: "colors.app.text" },
  transitionProperty: "color, border-bottom, text-shadow",
  transitionDuration: "0.1s",
  transitionTimingFunction: "ease",
  color: "var(--text-color)",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: { base: "app.subtextTransparent", _hover: "app.text" },
  textShadow: { base: "0 0 0 var(--text-color)", _hover: "0 0 2px var(--text-color)" },
});
const BetaLabel = css({
  padding: "2px 8px",
  borderRadius: "10px",
  fontSize: "8px",
  fontWeight: "normal",
  background: "label.normal.background",
  color: "label.normal.text",
});

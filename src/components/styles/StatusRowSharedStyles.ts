import { css } from "@styled-system/css";

export const TextStyle = css({
  "& a ": {
    position: "relative",
    color: "var(--link-text-color)",
    transition: "text-shadow 0.15s ease, border 0.15s ease",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: { base: "var(--link-text-color-trans)", _hover: "var(--link-text-color)" },
    textShadow: { base: "0 0 0px var(--link-text-color)", _hover: "0 0 2px var(--link-text-color)" },
    "--link-text-color": { base: "colors.link.default.opaque", _visited: "colors.link.visited.opaque" },
    "--link-text-color-trans": { base: "colors.link.default.transparent", _visited: "colors.link.visited.transparent" },
  },
});

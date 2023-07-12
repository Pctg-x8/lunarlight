import { styled } from "@styled-system/jsx";

const Button = styled("button", {
  base: {
    padding: "0.4rem 0.8rem",
    cursor: { base: "pointer", _disabled: "default" },
    borderRadius: "8px",
    boxShadow: { base: "inset 0 0 0 #000", _activeNotDisabled: "inset 0 0 4px #000" },
    transition: "background 0.1s ease, box-shadow 0.1s ease",
    _disabled: {
      bg: "button.primary.background.disabled !important",
      color: "button.primary.text.disabled !important",
    },
  },
  variants: {
    variant: {
      primary: {
        color: "button.primary.text.default",
        bg: {
          base: "button.primary.background.default",
          _hover: "button.primary.background.hover",
          _active: "utton.primary.background.active",
        },
      },
    },
  },
});
export default Button;

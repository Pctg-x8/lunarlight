import { styled } from "@styled-system/jsx";

const Button = styled("button", {
  base: {
    cursor: "pointer",
    borderRadius: "8px",
    boxShadow: "inset 0 0 0 #000",
    transition: "background 0.1s ease, box-shadow 0.1s ease",
    _active: {
      boxShadow: "inset 0 0 4px #000",
    },
    _disabled: {
      cursor: "default",
      bg: "button.primary.background.disabled !important",
      color: "button.primary.text.disabled !important",
    },
  },
  variants: {
    variant: {
      primary: {
        color: "button.primary.text.default",
        bg: "button.primary.background.default",
        _hover: {
          bg: "button.primary.background.hover",
        },
        _active: {
          bg: "button.primary.background.active",
        },
      },
    },
  },
});
export default Button;

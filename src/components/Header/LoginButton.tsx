"use client";

import { doLogin } from "@/actions/login";
import { css } from "@styled-system/css";
import { useTransition } from "react";

export default function LoginButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button className={PrimaryButton} type="button" onClick={() => startTransition(() => doLogin())} disabled={pending}>
      ログイン
    </button>
  );
}

const PrimaryButton = css({
  display: "block",
  height: "32px",
  width: "88px",
  cursor: "pointer",
  borderRadius: "8px",
  color: "button.primary.text.default",
  background: "button.primary.background.default",
  boxShadow: "inset 0 0 0 #000",
  transition: "background 0.1s ease, box-shadow 0.1s ease",
  _hover: {
    background: "button.primary.background.hover",
  },
  _active: {
    background: "button.primary.background.active",
    boxShadow: "inset 0 0 4px #000",
  },
  _disabled: {
    background: "button.primary.background.disabled !important",
    color: "button.primary.text.disabled",
    cursor: "default",
  },
});

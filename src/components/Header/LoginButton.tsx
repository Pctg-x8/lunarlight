"use client";

import { doLogin } from "@/actions/login";
import { styled } from "@linaria/react";
import { useTransition } from "react";

export default function LoginButton() {
  const [pending, startTransition] = useTransition();

  return (
    <StyledButton type="button" onClick={() => startTransition(() => doLogin())} disabled={pending}>
      ログイン
    </StyledButton>
  );
}

const StyledButton = styled.button`
  display: block;
  height: 32px;
  width: 88px;
  cursor: pointer;
  border: none;

  border-radius: 8px;
  color: var(--theme-primary-button-text);
  background: var(--theme-primary-button-bg);
  box-shadow: inset 0 0px 0px #000;
  transition: background 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    background: var(--theme-primary-button-bg-hover);
  }

  &:not(:disabled):active {
    background: var(--theme-primary-button-bg-active);
    box-shadow: inset 0 0px 4px #000;
  }

  &:disabled {
    background: var(--theme-primary-button-bg-disable);
    color: var(--theme-primary-button-text-disable);
    cursor: default;
  }
`;

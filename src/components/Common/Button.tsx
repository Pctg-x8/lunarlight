import { styled } from "@linaria/react";

export const Button = styled.button<{ readonly primary: boolean }>`
  display: block;
  padding: 0.4rem 0.8rem;
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

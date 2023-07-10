import { styled } from "@linaria/react";

export const Button = styled.button<{ readonly primary: boolean }>`
  display: block;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border: ${props => (props.primary || props.disabled ? "none" : "var(--theme-primary-button-text) 1px solid")};

  border-radius: 8px;
  color: var(--theme-primary-button-text);
  background: ${props => (props.primary ? "var(--theme-primary-button-bg)" : "var(--theme-button-bg)")};
  box-shadow: inset 0 0px 0px #000;
  transition: background 0.1s ease, box-shadow 0.1s ease, transform 0.1s ease;
  transform: scale(1);

  &:hover {
    background: ${props => (props.primary ? "var(--theme-primary-button-bg-hover)" : "var(--theme-button-bg-hover)")};
  }

  &:not(:disabled):active {
    background: ${props => (props.primary ? "var(--theme-primary-button-bg-active)" : "var(--theme-button-bg-active)")};
    box-shadow: inset 0 0px 4px #000;
    transform: scale(0.97);
  }

  &:disabled {
    background: var(--theme-button-bg-disable);
    color: var(--theme-button-text-disable);
    cursor: default;
  }
`;

import { styled } from "@linaria/react";

export default function BottomMenu(): JSX.Element {
  return <Frame>bottom menu</Frame>;
}

const Frame = styled.footer`
  width: 100%;
  background: var(--theme-menu-background);
`;

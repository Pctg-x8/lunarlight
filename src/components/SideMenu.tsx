import { styled } from "@linaria/react";

export default function SideMenu(): JSX.Element {
  return <Frame>SideMenu</Frame>;
}

const Frame = styled.nav`
  height: fit-content;
  background: var(--theme-menu-background);
`;

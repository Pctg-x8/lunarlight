import { BREAKPOINT_BOTTOM_MENU } from "@/breakpoints";
import SideMenu from "@/components/SideMenu";
import { styled } from "@linaria/react";

export default function PreferencesLayout({ children }: React.PropsWithChildren): JSX.Element {
  return (
    <ContentWrapper>
      <SideMenu />
      {children}
      <div className="right" />
    </ContentWrapper>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > nav {
    flex-grow: 0;
    flex-shrink: 0;

    @media (max-width: ${BREAKPOINT_BOTTOM_MENU}) {
      display: none;
    }
  }

  & > .right {
    flex: 0 0 320px;

    @media (max-width: calc(800px + 320px + 320px)) {
      display: none;
    }
  }
`;

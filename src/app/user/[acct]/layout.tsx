import { BREAKPOINT_BOTTOM_MENU } from "@/breakpoints";
import SideMenu from "@/components/SideMenu";
import { styled } from "@linaria/react";
import { PropsWithChildren } from "react";

export default function UserPostTemplate({ children }: PropsWithChildren): JSX.Element {
  return (
    <ContentWrapper>
      <SideMenu />
      <Frame>{children}</Frame>
      <div className="right" />
    </ContentWrapper>
  );
}

const Frame = styled.main`
  max-width: var(--single-max-width);
  width: 100%;
  flex: 1;

  @media (max-width: ${BREAKPOINT_BOTTOM_MENU}) {
    margin-bottom: calc(16px + 14px + 1rem + 16px);
  }
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > nav {
    position: sticky;
    top: 64px;
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

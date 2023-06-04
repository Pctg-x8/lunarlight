import { getAuthorizedAccountSSR } from "@/models/auth";
import { styled } from "@linaria/react";
import { Suspense } from "react";
import LoginAccountMenu from "./Header/LoginAccountMenu";
import LoginButton from "./Header/LoginButton";

export default function Header() {
  return (
    <AppHeader>
      <AppName />
      <Spacer />
      <LoginStatusArea>
        <Suspense>
          <LoginStatus />
        </Suspense>
      </LoginStatusArea>
    </AppHeader>
  );
}

function AppName() {
  return (
    <StyledAppName>
      <h1>
        Lunarlight{" "}
        <small>
          for{" "}
          <a className="non-colored" href="https://crescent.ct2.io/ll">
            crescent
          </a>
        </small>
      </h1>
      <h2>BETA</h2>
    </StyledAppName>
  );
}

async function LoginStatus() {
  const login = await getAuthorizedAccountSSR();

  return login ? <LoginAccountMenu account={login} /> : <LoginButton />;
}

const AppHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0px 0px 8px var(--theme-appheader-bottom);
  border-bottom: solid 1px var(--theme-appheader-bottom);
  position: sticky;
  top: 0px;
  background: rgb(var(--theme-background-elements), 80%);
  z-index: 1;
  backdrop-filter: blur(8px);
`;

const StyledAppName = styled.section`
  margin: 16px;
  display: flex;
  flex-direction: row;
  align-items: baseline;

  & > h1 {
    margin-right: 8px;
    font-size: 20px;

    & > small {
      font-size: 14px;
      font-weight: normal;
      opacity: 0.75;

      & > a {
        color: inherit;

        &::after {
          background: var(--theme-default-text);
        }
      }
    }
  }

  & > h2 {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 8px;
    font-weight: normal;
    background: var(--theme-normal-label-background);
    color: var(--theme-normal-label-text);
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const LoginStatusArea = styled.section`
  margin: 8px;
`;

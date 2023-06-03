"use client";

import { doLogin } from "@/actions/login";
import { CredentialAccount } from "@/models/api/mastodon/account";
import { styled } from "@linaria/react";
import Link from "next/link";
import { useTransition } from "react";

export default function LoginStatus({ login }: { readonly login: CredentialAccount | null }) {
  const [loginPending, startLogin] = useTransition();

  return !login ? (
    <LoginButton type="button" onClick={() => startLogin(() => doLogin())} disabled={loginPending}>
      ログイン
    </LoginButton>
  ) : (
    <AccountLink>
      <Link href={`/@${login.acct}`} title={`@${login.acct}`} className="no-default">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={login.avatar} alt={login.acct} />
      </Link>
    </AccountLink>
  );
}

const LoginButton = styled.button`
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

const AccountLink = styled.section`
  & > a {
    display: block;
    width: 36px;
    height: 36px;

    border-radius: 4px;
    box-shadow: 0 0 8px var(--theme-default-text);
    cursor: pointer;
    transition: box-shadow 0.2s ease-out;

    &:hover {
      box-shadow: 0 0 16px var(--theme-default-text);
    }

    & > img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
`;

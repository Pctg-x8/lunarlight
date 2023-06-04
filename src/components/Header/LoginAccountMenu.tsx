import { CredentialAccount } from "@/models/api/mastodon/account";
import { styled } from "@linaria/react";
import Link from "next/link";

export default function LoginAccountMenu({ account }: { readonly account: CredentialAccount }) {
  return (
    <AccountLink>
      <Link href={`/@${account.acct}`} title={`@${account.acct}`} className="no-default">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={account.avatar} alt={account.acct} />
      </Link>
    </AccountLink>
  );
}

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

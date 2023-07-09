import { CredentialAccount } from "@/models/api/mastodon/account";
import { css } from "@styled-system/css";
import Link from "next/link";

export default function LoginAccountMenu({ account }: { readonly account: CredentialAccount }) {
  return (
    <Link href={`/@${account.acct}`} title={`@${account.acct}`} className={AccountLink}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={account.avatar} alt={account.acct} />
    </Link>
  );
}

const AccountLink = css({
  display: "block",
  width: "36px",
  height: "36px",
  borderRadius: "4px",
  boxShadow: "0 0 8px var(--shadow-color)",
  boxShadowColor: "app.text",
  cursor: "pointer",
  transition: "box-shadow 0.2s ease",
  _hover: {
    boxShadow: "0 0 16px var(--shadow-color)",
  },
  "& > img": {
    width: "100%",
    height: "100%",
    borderRadius: "4px",
  },
});

import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@linaria/react";
import Link from "next/link";

export default function SideMenu(): JSX.Element {
  return (
    <Frame>
      <ul>
        <li>
          <Link href="/" className="no-default">
            <FontAwesomeIcon icon={faHouseChimney} />
            Home
          </Link>
        </li>
      </ul>
    </Frame>
  );
}

const Frame = styled.nav`
  height: fit-content;
  background: var(--theme-menu-background);

  & > ul > li > a {
    display: block;
    padding: 16px;
    text-decoration: none;

    transition: background 0.1s ease;
    background: rgb(255 255 255 / 0%);
    color: var(--theme-subtext);

    &:hover {
      background: rgb(255 255 255 / 5%);
      color: var(--theme-default-text);
    }

    & > svg {
      margin-right: 16px;
    }
  }
`;

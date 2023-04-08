import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@linaria/react";
import Link from "next/link";

export default function BottomMenu(): JSX.Element {
  return (
    <Frame>
      <ul>
        <li>
          <Link href="/" className="no-default">
            <FontAwesomeIcon icon={faHouseChimney} />
            <span>Home</span>
          </Link>
        </li>
      </ul>
    </Frame>
  );
}

const Frame = styled.footer`
  width: 100%;
  background: var(--theme-menu-background);

  & > ul {
    display: flex;
    flex-direction: row;
    justify-content: stretch;

    & > li {
      flex: 1;

      & > a {
        display: block;
        padding: 16px;
        text-decoration: none;
        text-align: center;

        transition: background 0.1s ease;
        background: rgb(255 255 255 / 0%);
        color: var(--theme-subtext);

        &:hover {
          background: rgb(255 255 255 / 5%);
          color: var(--theme-default-text);
        }

        & > svg {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        & > span {
          font-size: 12.5%;
        }
      }
    }
  }
`;

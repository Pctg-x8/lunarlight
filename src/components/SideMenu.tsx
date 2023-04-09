"use client";

import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@linaria/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideMenu(): JSX.Element {
  const path = usePathname();

  return (
    <Frame>
      <ul>
        <li>
          <Link href="/" className={`no-default ${path === "/" ? "active" : ""}`}>
            <FontAwesomeIcon icon={faHouseChimney} className="icon" />
            <span>Home</span>
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

    &.active {
      color: var(--theme-menu-active-link);
    }

    @media (max-width: calc(800px + 320px)) {
      text-align: center;

      & > .icon {
        display: block;
        margin-right: auto;
        margin-left: auto;
      }

      & > span {
        font-size: 1rem;
      }
    }
  }
`;

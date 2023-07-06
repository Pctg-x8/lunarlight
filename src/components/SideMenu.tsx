"use client";

import { faGear, faGlobe, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
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
        <li>
          <Link href="/public" className={`no-default ${path === "/public" ? "active" : ""}`}>
            <FontAwesomeIcon icon={faGlobe} className="icon" />
            <span>Public</span>
          </Link>
        </li>
        <li>
          <Link href="/preferences" className={`no-default ${path === "/preferences" ? "active" : ""}`}>
            <FontAwesomeIcon icon={faGear} className="icon" />
            <span className="full">Preferences</span>
            <span className="short">Prefs</span>
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

    .short {
      display: none;
    }

    .full {
      display: initial;
    }

    @media (max-width: calc(800px + 320px)) {
      text-align: center;
      padding-left: 0;
      padding-right: 0;

      & > .icon {
        display: block;
        margin-right: auto;
        margin-left: auto;
      }

      & > span {
        font-size: 1rem;
      }

      .short {
        display: initial;
      }

      .full {
        display: none;
      }
    }
  }
`;

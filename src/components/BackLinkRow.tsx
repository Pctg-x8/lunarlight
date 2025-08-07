"use client";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@styled-system/css";
import { useRouter } from "next/navigation";

export default function BackLinkRow() {
  const router = useRouter();

  return (
    <button className={Style} onClick={() => router.back()}>
      <FontAwesomeIcon icon={faArrowLeft} />
      もどる
    </button>
  );
}

const Style = css({
  display: "block",
  width: "100%",
  border: "none",
  cursor: "pointer",
  padding: "16px",
  textAlign: "start",
  color: "link.default.text",
  position: "relative",
  transition: "background 0.15s ease",
  background: { base: "backlink.default.background", _hover: "backlink.hover.background" },
});

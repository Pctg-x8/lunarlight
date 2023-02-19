"use client";

import style from "@/styles/components/BackLinkRow.module.scss";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function BackLinkRow() {
  const router = useRouter();

  return (
    <button className={style.backLinkRow} onClick={() => router.back()}>
      <FontAwesomeIcon icon={faArrowLeft} />
      もどる
    </button>
  );
}

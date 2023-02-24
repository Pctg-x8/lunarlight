import { faBookmark, faEllipsis, faReply, faRetweet, faShareNodes, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";

export default function StatusActions({ className }: { readonly className: string }) {
  return (
    <ul className={`${styles.statusActions} ${className}`}>
      <li>
        <button title="返信">
          <FontAwesomeIcon icon={faReply} />
        </button>
      </li>
      <li>
        <button title="ふぁぼ">
          <FontAwesomeIcon icon={faStar} />
        </button>
      </li>
      <li>
        <button title="ブースト">
          <FontAwesomeIcon icon={faRetweet} />
        </button>
      </li>
      <li>
        <button title="ブックマーク">
          <FontAwesomeIcon icon={faBookmark} />
        </button>
      </li>
      <li>
        <button title="共有">
          <FontAwesomeIcon icon={faShareNodes} />
        </button>
      </li>
      <li>
        <button title="その他">
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      </li>
    </ul>
  );
}

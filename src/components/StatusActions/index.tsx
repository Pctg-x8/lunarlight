import { Status } from "@/models/api/mastodon/status";
import { faBookmark, faEllipsis, faReply, faRetweet, faShareNodes, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";

export default function StatusActions({ status }: { readonly status: Status }) {
  return (
    <ul className={styles.statusActions}>
      <li>
        <button title="返信">
          <FontAwesomeIcon icon={faReply} />
          <span>{status.replies_count}</span>
        </button>
      </li>
      <li>
        <button title="ふぁぼ">
          <FontAwesomeIcon icon={faStar} />
          <span>{status.favourites_count}</span>
        </button>
      </li>
      <li>
        <button title="ブースト">
          <FontAwesomeIcon icon={faRetweet} />
          <span>{status.reblogs_count}</span>
        </button>
      </li>
      <li className={styles.nonCounter}>
        <button title="ブックマーク">
          <FontAwesomeIcon icon={faBookmark} />
        </button>
      </li>
      <li className={styles.nonCounter}>
        <button title="共有">
          <FontAwesomeIcon icon={faShareNodes} />
        </button>
      </li>
      <li className={styles.nonCounter}>
        <button title="その他">
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      </li>
    </ul>
  );
}

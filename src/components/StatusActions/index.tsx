import { Status } from "@/models/status";
import { faBookmark, faEllipsis, faReply, faRetweet, faShareNodes, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.scss";

export default function StatusActions({
  status,
  disabled = false,
}: {
  readonly status: Status;
  readonly disabled?: boolean;
}) {
  console.log(status);
  const { replied, favorited, reblogged } = status.counters;

  return (
    <ul className={styles.statusActions}>
      <li>
        <button title="返信" disabled={disabled}>
          <FontAwesomeIcon icon={faReply} />
          <span>{replied}</span>
        </button>
      </li>
      <li>
        <button title="ふぁぼ" disabled={disabled}>
          <FontAwesomeIcon icon={faStar} />
          <span>{favorited}</span>
        </button>
      </li>
      <li>
        <button title="ブースト" disabled={disabled}>
          <FontAwesomeIcon icon={faRetweet} />
          <span>{reblogged}</span>
        </button>
      </li>
      <li className={styles.nonCounter}>
        <button title="ブックマーク" disabled={disabled}>
          <FontAwesomeIcon icon={faBookmark} />
        </button>
      </li>
      <li className={styles.nonCounter}>
        <button title="共有" disabled={disabled}>
          <FontAwesomeIcon icon={faShareNodes} />
        </button>
      </li>
      <li className={styles.nonCounter}>
        <button title="その他" disabled={disabled}>
          <FontAwesomeIcon icon={faEllipsis} />
        </button>
      </li>
    </ul>
  );
}

import { css } from "@styled-system/css";
import Button from "../common/Button";

export default function NormalPostView(): JSX.Element {
  return (
    <form className={PostForm}>
      <textarea rows={2} className={PostArea} placeholder="ここに入力" />
      <Button variant="primary" className={PostButton}>
        投稿
      </Button>
    </form>
  );
}

const PostForm = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "appheader.bottom",
});

const PostArea = css({
  alignSelf: "stretch",
  background: "transparent",
  color: "app.text",
  outline: "none",
  m: "8px 8px 0 8px",
});

const PostButton = css({
  m: "8px",
  px: "24px",
});

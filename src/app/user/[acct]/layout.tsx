import { css } from "@styled-system/css";
import { PropsWithChildren } from "react";

export default function UserPostTemplate({ children }: PropsWithChildren): JSX.Element {
  return <main className={Framed}>{children}</main>;
}

const Framed = css({
  width: "content.maxWidth",
  marginLeft: "auto",
  marginRight: "auto",
});

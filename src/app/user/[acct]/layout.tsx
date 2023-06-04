import { styled } from "@linaria/react";
import { PropsWithChildren } from "react";

export default function UserPostTemplate({ children }: PropsWithChildren): JSX.Element {
  return <Frame>{children}</Frame>;
}

const Frame = styled.main`
  width: var(--single-max-width);
  margin-left: auto;
  margin-right: auto;
`;

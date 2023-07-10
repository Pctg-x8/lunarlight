"use client";

import { doLogin } from "@/actions/login";
import { useTransition } from "react";
import Button from "../common/Button";

export default function LoginButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="primary"
      display="block"
      height="32px"
      width="88px"
      type="button"
      onClick={() => startTransition(() => doLogin())}
      disabled={pending}
    >
      ログイン
    </Button>
  );
}

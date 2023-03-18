import { cookies } from "next/headers";

export namespace cookie {
  export function token(): string | undefined {
    return cookies().get("_lla")?.value;
  }
}

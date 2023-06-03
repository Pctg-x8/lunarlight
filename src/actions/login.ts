"use server";

import { getLoginUrl } from "@/models/auth";
import { redirect } from "next/navigation";

export async function doLogin() {
  redirect((await getLoginUrl()).toString());
}

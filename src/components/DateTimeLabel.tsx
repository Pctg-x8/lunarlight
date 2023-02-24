"use client";

import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
// TODO: あとでブラウザに応じて変化させたい（localeファイルをimportしてるからなんか難しそうだな......）
dayjs.locale(ja);

export default function DateTimeLabel({ at }: { readonly at: string }) {
  return <>{dayjs(at).format("LLLL")}</>;
}

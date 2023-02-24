"use client";

import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
// TODO: あとでブラウザに応じて変化させたい（localeファイルをimportしてるからなんか難しそうだな......）
dayjs.locale(ja);

export default function AgoLabel({ createdAt, className }: { readonly createdAt: string; readonly className: string }) {
  const obj = useMemo(() => dayjs.utc(createdAt).local(), [createdAt]);

  return (
    <p className={className} title={obj.format("LLL")}>
      {obj.fromNow()}
    </p>
  );
}

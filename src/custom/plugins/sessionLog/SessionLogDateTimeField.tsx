import { useRecordContext, useTranslate } from "ra-core";

import type { SessionLog } from "./types";

type SessionLogDateTimeFieldProps = {
  source: keyof SessionLog;
};

export const SessionLogDateTimeField = ({
  source,
}: SessionLogDateTimeFieldProps) => {
  const record = useRecordContext<SessionLog>();
  const translate = useTranslate();
  const value = record?.[source];

  if (!value || typeof value !== "string") {
    return <span>{translate("ra.message.empty", { _: "—" })}</span>;
  }

  return (
    <span>
      {new Date(value).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
};

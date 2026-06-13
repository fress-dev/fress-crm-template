import { useRecordContext, useTranslate } from "ra-core";

import type { Appointment } from "./types";

type AppointmentDateTimeFieldProps = {
  source: keyof Appointment;
};

export const AppointmentDateTimeField = ({
  source,
}: AppointmentDateTimeFieldProps) => {
  const record = useRecordContext<Appointment>();
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

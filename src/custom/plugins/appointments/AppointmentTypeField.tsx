import { useRecordContext } from "ra-core";

import { getAppointmentTypeLabel } from "./appointmentTypes";
import type { Appointment } from "./types";

export const AppointmentTypeField = () => {
  const record = useRecordContext<Appointment>();
  if (!record?.type) return null;

  return <span>{getAppointmentTypeLabel(record.type)}</span>;
};

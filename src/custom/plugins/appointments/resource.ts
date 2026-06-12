import type { PluginResourceProps } from "@/custom/platform/plugin/types";

import { AppointmentCreate } from "./AppointmentCreate";
import { AppointmentEdit } from "./AppointmentEdit";
import { AppointmentList } from "./AppointmentList";
import { AppointmentShow } from "./AppointmentShow";
import { getAppointmentTypeLabel } from "./appointmentTypes";
import type { Appointment } from "./types";

const formatRecordLabel = (record: Appointment): string => {
  if (record.title?.trim()) {
    return record.title;
  }
  const typeLabel = getAppointmentTypeLabel(record.type);
  const start = new Date(record.start_at).toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${typeLabel} ${start}`;
};

const appointmentsResource: PluginResourceProps = {
  list: AppointmentList,
  create: AppointmentCreate,
  edit: AppointmentEdit,
  show: AppointmentShow,
  recordRepresentation: (record) => formatRecordLabel(record as Appointment),
};

export default appointmentsResource;

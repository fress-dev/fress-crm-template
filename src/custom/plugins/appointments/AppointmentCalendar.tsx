import { format, getDay, parse, startOfWeek } from "date-fns";
import { ja } from "date-fns/locale";
import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { useListContext, useRedirect } from "ra-core";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { getAppointmentTypeLabel } from "./appointmentTypes";
import type { Appointment } from "./types";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { ja },
});

type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
};

const buildEventTitle = (record: Appointment): string => {
  const typeLabel = getAppointmentTypeLabel(record.type);
  if (record.title?.trim()) {
    return `${typeLabel}: ${record.title}`;
  }
  return typeLabel;
};

export const AppointmentCalendar = () => {
  const { data, isPending } = useListContext<Appointment>();
  const redirect = useRedirect();

  const events = useMemo<CalendarEvent[]>(() => {
    if (!data) return [];
    return data.map((record) => ({
      id: record.id,
      title: buildEventTitle(record),
      start: new Date(record.start_at),
      end: new Date(record.end_at),
      resource: record,
    }));
  }, [data]);

  if (isPending) return null;

  return (
    <div className="appointment-calendar mt-4 min-h-[600px] rounded-md border bg-card p-4">
      <Calendar
        localizer={localizer}
        culture="ja"
        events={events}
        defaultView={"week" as View}
        views={["month", "week"]}
        popup
        onSelectEvent={(event) => {
          redirect("show", "appointments", event.id);
        }}
        messages={{
          today: "今日",
          previous: "前へ",
          next: "次へ",
          month: "月",
          week: "週",
          day: "日",
          agenda: "予定",
          date: "日付",
          time: "時間",
          event: "予約",
          noEventsInRange: "この期間に予約はありません",
        }}
      />
    </div>
  );
};

import { format, getDay, parse, startOfWeek } from "date-fns";
import { ja } from "date-fns/locale";
import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { useGetMany, useListContext, useRedirect } from "ra-core";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { isRoomsPluginEnabled } from "@/custom/plugins/rooms/isRoomsPluginEnabled";

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

const buildEventTitle = (record: Appointment, roomName?: string): string => {
  const typeLabel = getAppointmentTypeLabel(record.type);
  const roomSuffix = roomName ? ` @ ${roomName}` : "";
  if (record.title?.trim()) {
    return `${typeLabel}: ${record.title}${roomSuffix}`;
  }
  return `${typeLabel}${roomSuffix}`;
};

export const AppointmentCalendar = () => {
  const { data, isPending } = useListContext<Appointment>();
  const redirect = useRedirect();
  const roomsEnabled = isRoomsPluginEnabled();

  const roomIds = useMemo(() => {
    if (!roomsEnabled || !data) return [];
    return [
      ...new Set(
        data
          .map((record) => record.room_id)
          .filter((id): id is number => id != null),
      ),
    ];
  }, [data, roomsEnabled]);

  const { data: rooms = [] } = useGetMany(
    "rooms",
    { ids: roomIds },
    { enabled: roomsEnabled && roomIds.length > 0 },
  );

  const roomNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const room of rooms) {
      if (room?.id != null && room.name) {
        map.set(Number(room.id), room.name);
      }
    }
    return map;
  }, [rooms]);

  const events = useMemo<CalendarEvent[]>(() => {
    if (!data) return [];
    return data.map((record) => ({
      id: record.id,
      title: buildEventTitle(
        record,
        record.room_id != null ? roomNameById.get(record.room_id) : undefined,
      ),
      start: new Date(record.start_at),
      end: new Date(record.end_at),
      resource: record,
    }));
  }, [data, roomNameById]);

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
        onSelectEvent={(event: CalendarEvent) => {
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

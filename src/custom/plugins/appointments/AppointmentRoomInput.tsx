import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectInput } from "@/components/admin/select-input";

import { isRoomsPluginEnabled } from "@/custom/plugins/rooms/isRoomsPluginEnabled";

import type { Appointment } from "./types";

const ACTIVE_ROOM_FILTER = { del_flg: false } as const;

/** 選択中店舗に属する有効部屋のみ選択可能 */
export const AppointmentRoomInput = () => {
  const { control, setValue } = useFormContext<Partial<Appointment>>();
  const storeId = useWatch({ control, name: "store_id" });
  const previousStoreId = useRef(storeId);

  useEffect(() => {
    if (previousStoreId.current === storeId) return;
    previousStoreId.current = storeId;
    setValue("room_id", null);
  }, [storeId, setValue]);

  if (!isRoomsPluginEnabled()) {
    return null;
  }

  return (
    <ReferenceInput
      reference="rooms"
      source="room_id"
      sort={{ field: "name", order: "ASC" }}
      filter={
        storeId ? { ...ACTIVE_ROOM_FILTER, store_id: storeId } : { id: -1 }
      }
    >
      <SelectInput
        helperText={false}
        optionText="name"
        emptyText="resources.appointments.fields.room_id"
      />
    </ReferenceInput>
  );
};

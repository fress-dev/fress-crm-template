import { useRecordContext, useTranslate } from "ra-core";

import { Badge } from "@/components/ui/badge";

import type { Room } from "./types";

export const RoomDeletedBadge = () => {
  const record = useRecordContext<Room>();
  const translate = useTranslate();

  if (!record?.del_flg) return null;

  return (
    <Badge variant="secondary">
      {translate("resources.rooms.status.deleted", { _: "削除済み" })}
    </Badge>
  );
};

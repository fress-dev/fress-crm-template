import { Trash } from "lucide-react";
import { useState } from "react";
import {
  useDeleteController,
  useGetRecordRepresentation,
  useRecordContext,
  useTranslate,
} from "ra-core";
import { Confirm } from "@/components/admin/confirm";
import { Button } from "@/components/ui/button";

import type { Room } from "./types";

export const RoomDeleteButton = () => {
  const record = useRecordContext<Room>();
  const translate = useTranslate();
  const getRecordRepresentation = useGetRecordRepresentation("rooms");
  const [open, setOpen] = useState(false);

  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "rooms",
    redirect: "/rooms",
    mutationMode: "pessimistic",
  });

  if (!record || record.del_flg) return null;

  const representation = getRecordRepresentation(record);
  const roomName =
    (typeof representation === "string" ? representation : null) ?? record.name;

  const onConfirm = () => {
    handleDelete();
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        <Trash className="size-4" />
        {translate("ra.action.delete")}
      </Button>
      <Confirm
        isOpen={open}
        loading={isPending}
        title="resources.rooms.confirm.delete_title"
        content="resources.rooms.confirm.delete_content"
        titleTranslateOptions={{
          name: roomName,
          _: `「${roomName}」を削除`,
        }}
        contentTranslateOptions={{
          name: roomName,
          _: "この部屋を一覧から非表示にします。",
        }}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

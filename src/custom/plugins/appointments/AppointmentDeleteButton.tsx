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

import type { Appointment } from "./types";

export const AppointmentDeleteButton = () => {
  const record = useRecordContext<Appointment>();
  const translate = useTranslate();
  const getRecordRepresentation = useGetRecordRepresentation("appointments");
  const [open, setOpen] = useState(false);

  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "appointments",
    redirect: "/appointments",
    mutationMode: "pessimistic",
  });

  if (!record || record.del_flg) return null;

  const representation = getRecordRepresentation(record);
  const label =
    (typeof representation === "string" ? representation : null) ??
    record.title ??
    translate("resources.appointments.name", { smart_count: 1 });

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
        title="resources.appointments.confirm.delete_title"
        content="resources.appointments.confirm.delete_content"
        titleTranslateOptions={{
          name: label,
          _: "この予約を削除",
        }}
        contentTranslateOptions={{
          _: "この予約を一覧から非表示にします。",
        }}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

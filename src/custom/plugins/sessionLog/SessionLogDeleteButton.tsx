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

import type { SessionLog } from "./types";

export const SessionLogDeleteButton = () => {
  const record = useRecordContext<SessionLog>();
  const translate = useTranslate();
  const getRecordRepresentation = useGetRecordRepresentation("session_logs");
  const [open, setOpen] = useState(false);

  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "session_logs",
    redirect: "/session_logs",
    mutationMode: "pessimistic",
  });

  if (!record || record.del_flg) return null;

  const representation = getRecordRepresentation(record);
  const label =
    (typeof representation === "string" ? representation : null) ??
    translate("resources.session_logs.name", { smart_count: 1 });

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
        title="resources.session_logs.confirm.delete_title"
        content="resources.session_logs.confirm.delete_content"
        titleTranslateOptions={{
          name: label,
          _: "このセッション記録を削除",
        }}
        contentTranslateOptions={{
          _: "このセッション記録を一覧から非表示にします。",
        }}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

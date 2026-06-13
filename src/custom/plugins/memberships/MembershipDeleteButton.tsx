import { Trash } from "lucide-react";
import { useState } from "react";
import {
  useDeleteController,
  useNotify,
  useRecordContext,
  useTranslate,
} from "ra-core";
import { Confirm } from "@/components/admin/confirm";
import { Button } from "@/components/ui/button";

import type { Membership } from "./types";

export const MembershipDeleteButton = () => {
  const record = useRecordContext<Membership>();
  const translate = useTranslate();
  const notify = useNotify();
  const [open, setOpen] = useState(false);

  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "memberships",
    redirect: "/memberships",
    mutationMode: "pessimistic",
    mutationOptions: {
      onError: (error) => {
        notify(
          error instanceof Error &&
            error.message.includes("delete_locked_tickets")
            ? translate("resources.memberships.error.delete_locked_tickets")
            : translate("ra.notification.http_error", { _: "Error" }),
          { type: "error" },
        );
      },
    },
  });

  if (!record) return null;

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
        title="resources.memberships.confirm.delete_title"
        content="resources.memberships.confirm.delete_content"
        titleTranslateOptions={{
          id: record.id,
          _: `契約 #${record.id} を削除`,
        }}
        contentTranslateOptions={{
          available: record.available_ticket_count ?? record.ticket_count,
          _: "未使用チケットを含む契約を削除します。",
        }}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

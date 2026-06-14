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

import type { TrainingGroup } from "./types";

export const TrainingGroupDeleteButton = () => {
  const record = useRecordContext<TrainingGroup>();
  const translate = useTranslate();
  const getRecordRepresentation = useGetRecordRepresentation("training_groups");
  const [open, setOpen] = useState(false);
  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "training_groups",
    redirect: "/training_groups",
    mutationMode: "pessimistic",
  });
  if (!record) return null;
  const representation = getRecordRepresentation(record);
  const name =
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
        title="resources.training_groups.confirm.delete_title"
        content="resources.training_groups.confirm.delete_content"
        titleTranslateOptions={{
          name,
          _: `「${name}」を削除`,
        }}
        contentTranslateOptions={{
          name,
          _: "この種目を削除します。よろしいですか？",
        }}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

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

import type { TrainingType } from "./types";

export const TrainingTypeDeleteButton = () => {
  const record = useRecordContext<TrainingType>();
  const translate = useTranslate();
  const getRecordRepresentation = useGetRecordRepresentation("training_types");
  const [open, setOpen] = useState(false);
  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "training_types",
    redirect: "/training_types",
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
        title="resources.training_types.confirm.delete_title"
        content="resources.training_types.confirm.delete_content"
        titleTranslateOptions={{
          name,
          _: `「${name}」を削除`,
        }}
        contentTranslateOptions={{
          name,
          _: "このカテゴリを削除します。種目が紐づいている場合は削除できません。",
        }}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

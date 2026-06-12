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

import type { Course } from "./types";

export const CourseDeleteButton = () => {
  const record = useRecordContext<Course>();
  const translate = useTranslate();
  const getRecordRepresentation = useGetRecordRepresentation("courses");
  const [open, setOpen] = useState(false);
  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "courses",
    redirect: "/courses",
    mutationMode: "pessimistic",
  });
  if (!record) return null;
  const representation = getRecordRepresentation(record);
  const courseName =
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
        title="resources.courses.confirm.delete_title"
        content="resources.courses.confirm.delete_content"
        titleTranslateOptions={{
          name: courseName,
          _: `「${courseName}」を削除`,
        }}
        contentTranslateOptions={{
          name: courseName,
          _: "このコースを削除します。契約などで参照されている場合は削除できません。",
        }}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

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

import type { Store } from "./types";

export const StoreDeleteButton = () => {
  const record = useRecordContext<Store>();
  const translate = useTranslate();
  const getRecordRepresentation = useGetRecordRepresentation("stores");
  const [open, setOpen] = useState(false);

  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "stores",
    redirect: "/stores",
    mutationMode: "pessimistic",
  });

  if (!record || record.del_flg) return null;

  const representation = getRecordRepresentation(record);
  const storeName =
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
        title="resources.stores.confirm.delete_title"
        content="resources.stores.confirm.delete_content"
        titleTranslateOptions={{
          name: storeName,
          _: `「${storeName}」を削除`,
        }}
        contentTranslateOptions={{
          name: storeName,
          _: "この店舗を一覧から非表示にします。在籍会員の参照は維持されます。",
        }}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

import { Trash } from "lucide-react";
import { useState } from "react";
import {
  useDataProvider,
  useDeleteController,
  useGetRecordRepresentation,
  useNotify,
  useRecordContext,
  useTranslate,
} from "ra-core";
import { Confirm } from "@/components/admin/confirm";
import { Button } from "@/components/ui/button";

import { countContactsForStore } from "./countContactsForStore";
import type { Store } from "./types";

export const StoreDeleteButton = () => {
  const record = useRecordContext<Store>();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();
  const getRecordRepresentation = useGetRecordRepresentation("stores");
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "stores",
    redirect: "/stores",
    mutationMode: "pessimistic",
  });

  if (!record) return null;

  const representation = getRecordRepresentation(record);
  const storeName =
    (typeof representation === "string" ? representation : null) ?? record.name;

  const onConfirm = async () => {
    setChecking(true);
    try {
      const contactCount = await countContactsForStore(dataProvider, record.id);
      if (contactCount > 0) {
        notify("resources.stores.validation.delete_has_contacts", {
          type: "error",
          messageArgs: {
            _: "在籍会員がいる店舗は削除できません。",
          },
        });
        setOpen(false);
        return;
      }
      handleDelete();
      setOpen(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        disabled={isPending || checking}
        onClick={() => setOpen(true)}
      >
        <Trash className="size-4" />
        {translate("ra.action.delete")}
      </Button>
      <Confirm
        isOpen={open}
        loading={isPending || checking}
        title="resources.stores.confirm.delete_title"
        content="resources.stores.confirm.delete_content"
        titleTranslateOptions={{
          name: storeName,
          _: `「${storeName}」を削除`,
        }}
        contentTranslateOptions={{
          name: storeName,
          _: "この店舗を削除してもよろしいですか？",
        }}
        onConfirm={() => void onConfirm()}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

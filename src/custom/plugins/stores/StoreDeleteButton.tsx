import { Trash } from "lucide-react";
import { useState } from "react";
import {
  useDataProvider,
  useDeleteController,
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
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const { handleDelete, isPending } = useDeleteController({
    record,
    resource: "stores",
    redirect: "/stores",
    mutationMode: "pessimistic",
  });

  if (!record) return null;

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
        title="ra.message.delete_title"
        content="ra.message.delete_content"
        titleTranslateOptions={{
          name: translate("resources.stores.name", { smart_count: 1 }),
          id: record.id,
        }}
        contentTranslateOptions={{
          name: translate("resources.stores.name", { smart_count: 1 }),
          id: record.id,
        }}
        onConfirm={() => void onConfirm()}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

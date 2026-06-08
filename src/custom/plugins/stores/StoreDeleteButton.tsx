import { Trash } from "lucide-react";
import {
  useDataProvider,
  useDelete,
  useNotify,
  useRecordContext,
  useRedirect,
  useTranslate,
} from "ra-core";
import { Button } from "@/components/ui/button";

import type { Store } from "./types";

export const StoreDeleteButton = () => {
  const record = useRecordContext<Store>();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const [deleteOne, { isPending }] = useDelete();

  if (!record) return null;

  const handleDelete = async () => {
    const { total } = await dataProvider.getList("contacts", {
      filter: { store_id: record.id },
      pagination: { page: 1, perPage: 1 },
      sort: { field: "id", order: "ASC" },
    });

    if (total && total > 0) {
      notify("resources.stores.validation.delete_has_contacts", {
        type: "error",
        messageArgs: {
          _: "在籍会員がいる店舗は削除できません。",
        },
      });
      return;
    }

    deleteOne(
      "stores",
      { id: record.id, previousData: record },
      {
        onSuccess: () => {
          notify("ra.notification.deleted", {
            type: "info",
            messageArgs: { smart_count: 1 },
          });
          redirect("/stores");
        },
      },
    );
  };

  return (
    <Button
      type="button"
      variant="destructive"
      disabled={isPending}
      onClick={() => void handleDelete()}
    >
      <Trash className="size-4" />
      {translate("ra.action.delete")}
    </Button>
  );
};

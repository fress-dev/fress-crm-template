import { useRecordContext, useTranslate } from "ra-core";

import { Badge } from "@/components/ui/badge";

import type { Store } from "./types";

export const StoreDeletedBadge = () => {
  const record = useRecordContext<Store>();
  const translate = useTranslate();

  if (!record?.del_flg) return null;

  return (
    <Badge variant="secondary">
      {translate("resources.stores.status.deleted", { _: "削除済み" })}
    </Badge>
  );
};

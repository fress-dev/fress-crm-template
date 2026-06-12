import { useRecordContext } from "ra-core";

import { StoreDeletedBadge } from "./StoreDeletedBadge";
import type { Store } from "./types";

export const StoreNameField = () => {
  const record = useRecordContext<Store>();

  if (!record) return null;

  return (
    <span className="inline-flex items-center gap-2">
      {record.name}
      <StoreDeletedBadge />
    </span>
  );
};

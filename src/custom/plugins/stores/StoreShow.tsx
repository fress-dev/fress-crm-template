import { EditButton } from "@/components/admin/edit-button";
import { RecordField } from "@/components/admin/record-field";
import { TextField } from "@/components/admin/text-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShowBase,
  useDataProvider,
  useRecordContext,
  useTranslate,
} from "ra-core";
import { useEffect, useState } from "react";

import { countContactsForStore } from "./countContactsForStore";
import { StoreCreatedAtField } from "./StoreCreatedAtField";
import { StoreDeleteButton } from "./StoreDeleteButton";
import { StoreDeletedBadge } from "./StoreDeletedBadge";
import { StorePageShell } from "./StorePageShell";
import type { Store } from "./types";

const EMPTY = "—";

const StoreContactCount = () => {
  const record = useRecordContext<Store>();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!record?.id) return;
    void countContactsForStore(dataProvider, record.id).then(setCount);
  }, [dataProvider, record?.id]);

  if (count === null) return null;

  return (
    <p className="text-sm text-muted-foreground">
      {translate("resources.stores.show.contact_count", {
        count,
        _: `在籍会員: ${count}人`,
      })}
    </p>
  );
};

export const StoreShow = () => (
  <ShowBase>
    <StorePageShell>
      <div className="flex justify-end gap-2 mb-4">
        <EditButton />
        <StoreDeleteButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TextField source="name" />
            <StoreDeletedBadge />
          </CardTitle>
          <StoreContactCount />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RecordField source="area_code">
            <TextField source="area_code" empty={EMPTY} />
          </RecordField>
          <RecordField source="zip">
            <TextField source="zip" empty={EMPTY} />
          </RecordField>
          <RecordField source="address">
            <TextField source="address" empty={EMPTY} />
          </RecordField>
          <RecordField source="build">
            <TextField source="build" empty={EMPTY} />
          </RecordField>
          <RecordField source="created_at">
            <StoreCreatedAtField />
          </RecordField>
        </CardContent>
      </Card>
    </StorePageShell>
  </ShowBase>
);

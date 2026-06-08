import { EditButton } from "@/components/admin/edit-button";
import { SimpleShowLayout } from "@/components/admin/simple-show-layout";
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
import { StoreDeleteButton } from "./StoreDeleteButton";
import type { Store } from "./types";

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
    <div className="mt-2 max-w-2xl">
      <div className="flex justify-end gap-2 mb-4">
        <EditButton />
        <StoreDeleteButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <TextField source="name" />
          </CardTitle>
          <StoreContactCount />
        </CardHeader>
        <CardContent>
          <SimpleShowLayout>
            <TextField source="area_code" />
            <TextField source="zip" />
            <TextField source="address" />
            <TextField source="build" />
            <TextField source="created_at" />
          </SimpleShowLayout>
        </CardContent>
      </Card>
    </div>
  </ShowBase>
);

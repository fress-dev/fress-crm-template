import { EditBase, Form, useRecordContext } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { FormToolbar } from "@/components/atomic-crm/layout/FormToolbar";
import { cleanupStoreForSave, StoreInputs } from "./StoreInputs";
import { StoreDeleteButton } from "./StoreDeleteButton";
import { StoreDeletedBadge } from "./StoreDeletedBadge";
import { StorePageShell } from "./StorePageShell";
import type { Store } from "./types";

const StoreEditDelete = () => {
  const record = useRecordContext<Store>();
  if (record?.del_flg) return null;

  return (
    <div className="flex justify-start pt-2">
      <StoreDeleteButton />
    </div>
  );
};

export const StoreEdit = () => (
  <EditBase actions={false} redirect="show" transform={cleanupStoreForSave}>
    <StorePageShell>
      <Form className="flex flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <div className="mb-4">
              <StoreDeletedBadge />
            </div>
            <StoreInputs />
            <StoreEditDelete />
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </StorePageShell>
  </EditBase>
);

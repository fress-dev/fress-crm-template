import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { FormToolbar } from "@/components/atomic-crm/layout/FormToolbar";
import { cleanupStoreForSave, StoreInputs } from "./StoreInputs";
import { StoreDeleteButton } from "./StoreDeleteButton";
import { StorePageShell } from "./StorePageShell";

export const StoreEdit = () => (
  <EditBase actions={false} redirect="show" transform={cleanupStoreForSave}>
    <StorePageShell>
      <Form className="flex flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <StoreInputs />
            <div className="flex justify-start pt-2">
              <StoreDeleteButton />
            </div>
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </StorePageShell>
  </EditBase>
);

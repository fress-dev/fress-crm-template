import { CreateBase, Form, useTranslate } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";

import { cleanupStoreForSave, StoreInputs } from "./StoreInputs";
import { StorePageShell } from "./StorePageShell";

export const StoreCreate = () => {
  const translate = useTranslate();

  return (
    <CreateBase redirect="show" transform={cleanupStoreForSave}>
      <StorePageShell>
        <Form>
          <Card>
            <CardContent>
              <StoreInputs />
              <div
                role="toolbar"
                className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
              >
                <CancelButton />
                <SaveButton
                  label={translate("resources.stores.action.create", {
                    _: "Create Store",
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </Form>
      </StorePageShell>
    </CreateBase>
  );
};

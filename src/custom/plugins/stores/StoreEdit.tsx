import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { FormToolbar } from "@/components/atomic-crm/layout/FormToolbar";
import { StoreInputs } from "./StoreInputs";

export const StoreEdit = () => (
  <EditBase actions={false} redirect="list">
    <div className="mt-2 flex lg:mr-72">
      <Form className="flex flex-1 flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <StoreInputs />
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </div>
  </EditBase>
);

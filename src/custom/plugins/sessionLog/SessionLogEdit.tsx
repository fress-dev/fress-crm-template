import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { FormToolbar } from "@/components/atomic-crm/layout/FormToolbar";

import { SessionLogDeleteButton } from "./SessionLogDeleteButton";
import { SessionLogInputs } from "./SessionLogInputs";
import { SessionLogPageShell } from "./SessionLogPageShell";

export const SessionLogEdit = () => (
  <EditBase actions={false} redirect="show">
    <SessionLogPageShell>
      <Form className="flex flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <SessionLogInputs />
            <div className="flex justify-start pt-2">
              <SessionLogDeleteButton />
            </div>
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </SessionLogPageShell>
  </EditBase>
);

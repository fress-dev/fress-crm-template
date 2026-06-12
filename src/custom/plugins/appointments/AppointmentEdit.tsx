import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { FormToolbar } from "@/components/atomic-crm/layout/FormToolbar";

import { AppointmentDeleteButton } from "./AppointmentDeleteButton";
import { AppointmentInputs } from "./AppointmentInputs";
import { AppointmentPageShell } from "./AppointmentPageShell";

export const AppointmentEdit = () => (
  <EditBase actions={false} redirect="show">
    <AppointmentPageShell>
      <Form className="flex flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <AppointmentInputs />
            <div className="flex justify-start pt-2">
              <AppointmentDeleteButton />
            </div>
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </AppointmentPageShell>
  </EditBase>
);

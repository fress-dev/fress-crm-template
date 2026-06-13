import { CreateBase, Form, useGetIdentity, useTranslate } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";

import { AppointmentInputs } from "./AppointmentInputs";
import { AppointmentPageShell } from "./AppointmentPageShell";

export const AppointmentCreate = () => {
  const translate = useTranslate();
  const { identity } = useGetIdentity();

  return (
    <CreateBase redirect="show">
      <AppointmentPageShell>
        <Form defaultValues={{ sales_id: identity?.id }}>
          <Card>
            <CardContent>
              <AppointmentInputs />
              <div
                role="toolbar"
                className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
              >
                <CancelButton />
                <SaveButton
                  label={translate("resources.appointments.action.create", {
                    _: "Create Appointment",
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </Form>
      </AppointmentPageShell>
    </CreateBase>
  );
};

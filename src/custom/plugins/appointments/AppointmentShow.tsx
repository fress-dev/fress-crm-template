import { EditButton } from "@/components/admin/edit-button";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShowBase } from "ra-core";

import { AppointmentDeleteButton } from "./AppointmentDeleteButton";
import { AppointmentPageShell } from "./AppointmentPageShell";
import { AppointmentTypeField } from "./AppointmentTypeField";
import { AppointmentDateTimeField } from "./AppointmentDateTimeField";

const EMPTY = "—";

export const AppointmentShow = () => (
  <ShowBase>
    <AppointmentPageShell>
      <div className="flex justify-end gap-2 mb-4">
        <EditButton />
        <AppointmentDeleteButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <TextField source="title" empty={EMPTY} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RecordField
            source="contact_id"
            label="resources.appointments.fields.contact_id"
          >
            <ReferenceField
              source="contact_id"
              reference="contacts"
              link="show"
            >
              <TextField source="last_name" />
            </ReferenceField>
          </RecordField>
          <RecordField
            source="sales_id"
            label="resources.appointments.fields.sales_id"
          >
            <ReferenceField source="sales_id" reference="sales" link="show">
              <TextField source="last_name" />
            </ReferenceField>
          </RecordField>
          <RecordField
            source="store_id"
            label="resources.appointments.fields.store_id"
          >
            <ReferenceField source="store_id" reference="stores" link="show">
              <TextField source="name" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField source="type" label="resources.appointments.fields.type">
            <AppointmentTypeField />
          </RecordField>
          <RecordField
            source="start_at"
            label="resources.appointments.fields.start_at"
          >
            <AppointmentDateTimeField source="start_at" />
          </RecordField>
          <RecordField
            source="end_at"
            label="resources.appointments.fields.end_at"
          >
            <AppointmentDateTimeField source="end_at" />
          </RecordField>
          <RecordField
            source="created_at"
            label="resources.appointments.fields.created_at"
          >
            <AppointmentDateTimeField source="created_at" />
          </RecordField>
        </CardContent>
      </Card>
    </AppointmentPageShell>
  </ShowBase>
);

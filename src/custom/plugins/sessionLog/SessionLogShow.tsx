import { EditButton } from "@/components/admin/edit-button";
import { DateField } from "@/components/admin/date-field";
import { NumberField } from "@/components/admin/number-field";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShowBase } from "ra-core";

import { SessionLogDateTimeField } from "./SessionLogDateTimeField";

import { SessionLogDeleteButton } from "./SessionLogDeleteButton";
import { SessionLogPageShell } from "./SessionLogPageShell";

const EMPTY = "—";

export const SessionLogShow = () => (
  <ShowBase>
    <SessionLogPageShell>
      <div className="flex justify-end gap-2 mb-4">
        <EditButton />
        <SessionLogDeleteButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <DateField source="performed_at" showTime empty={EMPTY} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RecordField
            source="contact_id"
            label="resources.session_logs.fields.contact_id"
          >
            <ReferenceField
              source="contact_id"
              reference="contacts"
              link="show"
            >
              <TextField source="last_name" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField
            source="sales_id"
            label="resources.session_logs.fields.sales_id"
          >
            <ReferenceField source="sales_id" reference="sales" link="show">
              <TextField source="last_name" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField
            source="store_id"
            label="resources.session_logs.fields.store_id"
          >
            <ReferenceField source="store_id" reference="stores" link="show">
              <TextField source="name" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField
            source="appointment_id"
            label="resources.session_logs.fields.appointment_id"
          >
            <ReferenceField
              source="appointment_id"
              reference="appointments"
              link="show"
            >
              <TextField source="title" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField
            source="membership_ticket_id"
            label="resources.session_logs.fields.membership_ticket_id"
          >
            <ReferenceField
              source="membership_ticket_id"
              reference="membership_tickets"
              link={false}
            >
              <TextField source="ticket_number" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField
            source="performed_at"
            label="resources.session_logs.fields.performed_at"
          >
            <SessionLogDateTimeField source="performed_at" />
          </RecordField>
          <RecordField
            source="weight_kg"
            label="resources.session_logs.fields.weight_kg"
          >
            <NumberField source="weight_kg" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="body_fat_percent"
            label="resources.session_logs.fields.body_fat_percent"
          >
            <NumberField source="body_fat_percent" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="visceral_fat_level"
            label="resources.session_logs.fields.visceral_fat_level"
          >
            <NumberField source="visceral_fat_level" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="blood_pressure"
            label="resources.session_logs.fields.blood_pressure"
          >
            <TextField source="blood_pressure" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="waist_cm"
            label="resources.session_logs.fields.waist_cm"
          >
            <NumberField source="waist_cm" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="basal_metabolism_kcal"
            label="resources.session_logs.fields.basal_metabolism_kcal"
          >
            <NumberField source="basal_metabolism_kcal" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="muscle_mass_kg"
            label="resources.session_logs.fields.muscle_mass_kg"
          >
            <NumberField source="muscle_mass_kg" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="body_age"
            label="resources.session_logs.fields.body_age"
          >
            <NumberField source="body_age" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="body_water_percent"
            label="resources.session_logs.fields.body_water_percent"
          >
            <NumberField source="body_water_percent" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="comment"
            label="resources.session_logs.fields.comment"
          >
            <TextField source="comment" empty={EMPTY} />
          </RecordField>
          <RecordField
            source="created_at"
            label="resources.session_logs.fields.created_at"
          >
            <DateField source="created_at" showTime empty={EMPTY} />
          </RecordField>
        </CardContent>
      </Card>
    </SessionLogPageShell>
  </ShowBase>
);

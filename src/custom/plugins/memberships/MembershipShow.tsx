import { EditButton } from "@/components/admin/edit-button";
import { DateField } from "@/components/admin/date-field";
import { NumberField } from "@/components/admin/number-field";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { SelectField } from "@/components/admin/select-field";
import { TextField } from "@/components/admin/text-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShowBase } from "ra-core";

import { MembershipDeleteButton } from "./MembershipDeleteButton";
import { MembershipTicketTable } from "./MembershipTicketTable";
import { MembershipPageShell } from "./MembershipPageShell";
import { MEMBERSHIP_STATUS_CHOICES } from "./membershipModel";

const EMPTY = "—";

export const MembershipShow = () => (
  <ShowBase>
    <MembershipPageShell>
      <div className="flex justify-end gap-2 mb-4">
        <EditButton />
        <MembershipDeleteButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <NumberField source="id" options={{ style: "decimal" }} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RecordField source="contact_id">
            <ReferenceField
              source="contact_id"
              reference="contacts"
              link="show"
            >
              <TextField source="last_name" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField source="course_id">
            <ReferenceField source="course_id" reference="courses" link="show">
              <TextField source="name" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField source="store_id">
            <ReferenceField source="store_id" reference="stores" link="show">
              <TextField source="name" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField source="ticket_count">
            <NumberField source="ticket_count" />
          </RecordField>
          <RecordField source="available_ticket_count">
            <NumberField source="available_ticket_count" />
          </RecordField>
          <RecordField source="used_ticket_count">
            <NumberField source="used_ticket_count" />
          </RecordField>
          <RecordField source="status">
            <SelectField
              source="status"
              choices={MEMBERSHIP_STATUS_CHOICES}
              empty={EMPTY}
            />
          </RecordField>
          <RecordField source="started_at">
            <DateField source="started_at" empty={EMPTY} />
          </RecordField>
          <RecordField source="ended_at">
            <DateField source="ended_at" empty={EMPTY} />
          </RecordField>
          <RecordField source="notes">
            <TextField source="notes" empty={EMPTY} />
          </RecordField>
          <RecordField source="created_at">
            <DateField source="created_at" showTime empty={EMPTY} />
          </RecordField>
        </CardContent>
      </Card>
      <MembershipTicketTable />
    </MembershipPageShell>
  </ShowBase>
);

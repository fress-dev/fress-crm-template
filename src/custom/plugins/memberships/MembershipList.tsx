import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { DateField } from "@/components/admin/date-field";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { NumberField } from "@/components/admin/number-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectField } from "@/components/admin/select-field";
import { SelectInput } from "@/components/admin/select-input";
import { TextField } from "@/components/admin/text-field";
import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";

import { MembershipEmpty } from "./MembershipEmpty";
import { MEMBERSHIP_STATUS_CHOICES } from "./membershipModel";

const membershipFilters = [
  <ReferenceInput
    source="contact_id"
    reference="contacts"
    key="contact_id"
    alwaysOn
  >
    <AutocompleteInput
      optionText="last_name"
      label="resources.memberships.fields.contact_id"
    />
  </ReferenceInput>,
  <ReferenceInput
    source="course_id"
    reference="courses"
    key="course_id"
    alwaysOn
  >
    <AutocompleteInput
      optionText="name"
      label="resources.memberships.fields.course_id"
    />
  </ReferenceInput>,
  <SelectInput
    source="status"
    choices={MEMBERSHIP_STATUS_CHOICES}
    key="status"
    alwaysOn
  />,
];

const MembershipListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.memberships.action.new" />
  </TopToolbar>
);

export const MembershipList = () => (
  <List
    filters={membershipFilters}
    actions={<MembershipListActions />}
    sort={{ field: "created_at", order: "DESC" }}
    empty={<MembershipEmpty />}
  >
    <DataTable rowClick="show">
      <DataTable.Col source="contact_id">
        <ReferenceField source="contact_id" reference="contacts" link={false}>
          <TextField source="last_name" empty="—" />
        </ReferenceField>
      </DataTable.Col>
      <DataTable.Col source="course_id">
        <ReferenceField source="course_id" reference="courses" link={false}>
          <TextField source="name" empty="—" />
        </ReferenceField>
      </DataTable.Col>
      <DataTable.Col source="ticket_count">
        <NumberField source="ticket_count" />
      </DataTable.Col>
      <DataTable.Col source="status">
        <SelectField source="status" choices={MEMBERSHIP_STATUS_CHOICES} />
      </DataTable.Col>
      <DataTable.Col source="started_at">
        <DateField source="started_at" empty="—" />
      </DataTable.Col>
      <DataTable.Col source="created_at">
        <DateField source="created_at" showTime />
      </DataTable.Col>
    </DataTable>
  </List>
);

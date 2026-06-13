import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { NumberField } from "@/components/admin/number-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SearchInput } from "@/components/admin/search-input";
import { TextField } from "@/components/admin/text-field";
import { useTranslate } from "ra-core";

import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";
import { SessionLogDateTimeField } from "./SessionLogDateTimeField";
import { ACTIVE_STORE_FILTER } from "@/custom/plugins/stores/withStoresDataProvider";

import { SessionLogEmpty } from "./SessionLogEmpty";

const SessionLogListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.session_logs.action.new" />
  </TopToolbar>
);

export const SessionLogList = () => {
  const translate = useTranslate();

  const filters = [
    <SearchInput source="q" alwaysOn key="q" />,
    <ReferenceInput source="contact_id" reference="contacts" key="contact_id">
      <AutocompleteInput
        label={false}
        placeholder={translate("resources.session_logs.fields.contact_id")}
      />
    </ReferenceInput>,
    <ReferenceInput
      source="sales_id"
      reference="sales"
      filter={{ "disabled@neq": true }}
      key="sales_id"
    >
      <AutocompleteInput
        label={false}
        placeholder={translate("resources.session_logs.fields.sales_id")}
      />
    </ReferenceInput>,
    <ReferenceInput
      source="store_id"
      reference="stores"
      filter={ACTIVE_STORE_FILTER}
      key="store_id"
    >
      <AutocompleteInput
        label={false}
        placeholder={translate("resources.session_logs.fields.store_id")}
      />
    </ReferenceInput>,
  ];

  return (
    <List
      filters={filters}
      actions={<SessionLogListActions />}
      sort={{ field: "performed_at", order: "DESC" }}
      empty={<SessionLogEmpty />}
    >
      <DataTable rowClick="show">
        <DataTable.Col source="performed_at">
          <SessionLogDateTimeField source="performed_at" />
        </DataTable.Col>
        <DataTable.Col source="contact_id">
          <ReferenceField source="contact_id" reference="contacts" link="show">
            <TextField source="last_name" empty="—" />
          </ReferenceField>
        </DataTable.Col>
        <DataTable.Col source="sales_id">
          <ReferenceField source="sales_id" reference="sales" link="show">
            <TextField source="last_name" empty="—" />
          </ReferenceField>
        </DataTable.Col>
        <DataTable.Col source="store_id">
          <ReferenceField source="store_id" reference="stores" link="show">
            <TextField source="name" empty="—" />
          </ReferenceField>
        </DataTable.Col>
        <DataTable.Col source="weight_kg">
          <NumberField source="weight_kg" empty="—" />
        </DataTable.Col>
        <DataTable.Col source="comment">
          <TextField source="comment" empty="—" />
        </DataTable.Col>
      </DataTable>
    </List>
  );
};

import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { DateField } from "@/components/admin/date-field";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { ReferenceField } from "@/components/admin/reference-field";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SearchInput } from "@/components/admin/search-input";
import { TextField } from "@/components/admin/text-field";
import { ToggleFilterButton } from "@/components/admin/toggle-filter-button";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { useGetIdentity, useGetOne } from "ra-core";

import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";
import { ACTIVE_STORE_FILTER } from "@/custom/plugins/stores/withStoresDataProvider";

import { RoomEmpty } from "./RoomEmpty";

const IncludeDeletedRoomsFilter = () => (
  <ToggleFilterButton
    label="resources.rooms.filters.include_deleted"
    value={{ include_deleted: true }}
  />
);

const RoomListActions = ({ isAdmin }: { isAdmin: boolean }) => (
  <TopToolbar>
    {isAdmin ? <IncludeDeletedRoomsFilter /> : null}
    <ExportButton />
    <CreateButton label="resources.rooms.action.new" />
  </TopToolbar>
);

const roomFilters = [
  <SearchInput source="q" alwaysOn key="q" />,
  <ReferenceInput
    source="store_id"
    reference="stores"
    key="store_id"
    alwaysOn
    filter={ACTIVE_STORE_FILTER}
    sort={{ field: "name", order: "ASC" }}
  >
    <AutocompleteInput
      optionText="name"
      label="resources.rooms.fields.store_id"
    />
  </ReferenceInput>,
];

export const RoomList = () => {
  const { identity } = useGetIdentity();
  const { data: sale } = useGetOne(
    "sales",
    { id: identity?.id ?? "" },
    { enabled: identity?.id != null },
  );
  const isAdmin = sale?.administrator === true;

  return (
    <List
      filters={roomFilters}
      actions={<RoomListActions isAdmin={isAdmin} />}
      sort={{ field: "name", order: "ASC" }}
      empty={<RoomEmpty />}
    >
      <DataTable rowClick="show">
        <DataTable.Col source="name">
          <TextField source="name" />
        </DataTable.Col>
        <DataTable.Col source="store_id">
          <ReferenceField source="store_id" reference="stores" link={false}>
            <TextField source="name" empty="—" />
          </ReferenceField>
        </DataTable.Col>
        <DataTable.Col source="created_at">
          <DateField source="created_at" showTime />
        </DataTable.Col>
      </DataTable>
    </List>
  );
};

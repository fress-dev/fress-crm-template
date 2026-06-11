import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";
import { ToggleFilterButton } from "@/components/admin/toggle-filter-button";
import { useGetIdentity, useGetOne } from "ra-core";

import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";

import { StoreCreatedAtField } from "./StoreCreatedAtField";
import { StoreEmpty } from "./StoreEmpty";
import { StoreNameField } from "./StoreNameField";

/** FilterForm の alwaysOn で常時表示するラッパー */
const IncludeDeletedStoresFilter = ({
  alwaysOn: _alwaysOn,
}: {
  alwaysOn?: boolean;
}) => (
  <ToggleFilterButton
    label="resources.stores.filters.include_deleted"
    value={{ include_deleted: true }}
  />
);

const StoreListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.stores.action.new" />
  </TopToolbar>
);

export const StoreList = () => {
  const { identity } = useGetIdentity();
  const { data: sale } = useGetOne(
    "sales",
    { id: identity?.id ?? "" },
    { enabled: identity?.id != null },
  );
  const isAdmin = sale?.administrator === true;
  const filters = [
    <SearchInput source="q" alwaysOn key="q" />,
    ...(isAdmin
      ? [<IncludeDeletedStoresFilter alwaysOn key="include_deleted" />]
      : []),
  ];

  return (
    <List
      filters={filters}
      actions={<StoreListActions />}
      sort={{ field: "name", order: "ASC" }}
      empty={<StoreEmpty />}
    >
      <DataTable rowClick="show">
        <DataTable.Col source="name">
          <StoreNameField />
        </DataTable.Col>
        <DataTable.Col source="area_code" />
        <DataTable.Col source="address" />
        <DataTable.Col source="created_at">
          <StoreCreatedAtField />
        </DataTable.Col>
      </DataTable>
    </List>
  );
};

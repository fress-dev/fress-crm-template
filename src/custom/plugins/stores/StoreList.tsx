import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";

import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";

import { StoreEmpty } from "./StoreEmpty";

const StoreListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.stores.action.new" />
  </TopToolbar>
);

const filters = [<SearchInput source="q" alwaysOn />];

export const StoreList = () => (
  <List
    filters={filters}
    actions={<StoreListActions />}
    sort={{ field: "name", order: "ASC" }}
    empty={<StoreEmpty />}
  >
    <DataTable rowClick="show">
      <DataTable.Col source="name" />
      <DataTable.Col source="area_code" />
      <DataTable.Col source="address" />
      <DataTable.Col source="created_at" />
    </DataTable>
  </List>
);

import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { NumberField } from "@/components/admin/number-field";
import { SearchInput } from "@/components/admin/search-input";
import { TextField } from "@/components/admin/text-field";
import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";

import { TrainingActiveField } from "./TrainingActiveField";
import { TrainingCreatedAtField } from "./TrainingCreatedAtField";
import { TrainingTypeEmpty } from "./TrainingTypeEmpty";

const TrainingTypeListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.training_types.action.new" />
  </TopToolbar>
);

export const TrainingTypeList = () => (
  <List
    filters={[<SearchInput source="q" alwaysOn key="q" />]}
    actions={<TrainingTypeListActions />}
    sort={{ field: "display_order", order: "ASC" }}
    empty={<TrainingTypeEmpty />}
  >
    <DataTable rowClick="edit">
      <DataTable.Col source="name">
        <TextField source="name" />
      </DataTable.Col>
      <DataTable.Col source="display_order">
        <NumberField source="display_order" />
      </DataTable.Col>
      <DataTable.Col source="is_active">
        <TrainingActiveField resource="training_types" />
      </DataTable.Col>
      <DataTable.Col source="created_at">
        <TrainingCreatedAtField />
      </DataTable.Col>
    </DataTable>
  </List>
);

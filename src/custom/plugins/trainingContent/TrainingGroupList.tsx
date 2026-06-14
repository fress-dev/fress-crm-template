import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { NumberField } from "@/components/admin/number-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { SearchInput } from "@/components/admin/search-input";
import { TextField } from "@/components/admin/text-field";
import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";

import { TrainingActiveField } from "./TrainingActiveField";
import { TrainingCreatedAtField } from "./TrainingCreatedAtField";
import { TrainingGroupEmpty } from "./TrainingGroupEmpty";

const TrainingGroupListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.training_groups.action.new" />
  </TopToolbar>
);

export const TrainingGroupList = () => (
  <List
    filters={[<SearchInput source="q" alwaysOn key="q" />]}
    actions={<TrainingGroupListActions />}
    sort={{ field: "display_order", order: "ASC" }}
    empty={<TrainingGroupEmpty />}
  >
    <DataTable rowClick="show">
      <DataTable.Col source="name">
        <TextField source="name" />
      </DataTable.Col>
      <DataTable.Col source="training_type_id">
        <ReferenceField
          source="training_type_id"
          reference="training_types"
          link={false}
        >
          <TextField source="name" />
        </ReferenceField>
      </DataTable.Col>
      <DataTable.Col source="display_order">
        <NumberField source="display_order" />
      </DataTable.Col>
      <DataTable.Col source="is_active">
        <TrainingActiveField resource="training_groups" />
      </DataTable.Col>
      <DataTable.Col source="created_at">
        <TrainingCreatedAtField />
      </DataTable.Col>
    </DataTable>
  </List>
);

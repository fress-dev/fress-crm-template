import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { NumberField } from "@/components/admin/number-field";
import { SearchInput } from "@/components/admin/search-input";
import { SelectField } from "@/components/admin/select-field";
import { TextField } from "@/components/admin/text-field";
import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";

import { CourseActiveField } from "./CourseActiveField";
import { CourseCreatedAtField } from "./CourseCreatedAtField";
import { CourseEmpty } from "./CourseEmpty";
import {
  COURSE_SERVICE_KIND_CHOICES,
  COURSE_TYPE_CHOICES,
} from "./courseModel";

const CourseListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.courses.action.new" />
  </TopToolbar>
);

export const CourseList = () => (
  <List
    filters={[<SearchInput source="q" alwaysOn key="q" />]}
    actions={<CourseListActions />}
    sort={{ field: "display_order", order: "ASC" }}
    empty={<CourseEmpty />}
  >
    <DataTable rowClick="show">
      <DataTable.Col source="name">
        <TextField source="name" />
      </DataTable.Col>
      <DataTable.Col source="course_type">
        <SelectField source="course_type" choices={COURSE_TYPE_CHOICES} />
      </DataTable.Col>
      <DataTable.Col source="service_kind">
        <SelectField
          source="service_kind"
          choices={COURSE_SERVICE_KIND_CHOICES}
        />
      </DataTable.Col>
      <DataTable.Col source="duration_minutes">
        <NumberField source="duration_minutes" />
      </DataTable.Col>
      <DataTable.Col source="is_active">
        <CourseActiveField />
      </DataTable.Col>
      <DataTable.Col source="created_at">
        <CourseCreatedAtField />
      </DataTable.Col>
    </DataTable>
  </List>
);

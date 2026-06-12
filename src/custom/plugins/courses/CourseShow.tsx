import { EditButton } from "@/components/admin/edit-button";
import { NumberField } from "@/components/admin/number-field";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceArrayField } from "@/components/admin/reference-array-field";
import { SelectField } from "@/components/admin/select-field";
import { SingleFieldList } from "@/components/admin/single-field-list";
import { TextField } from "@/components/admin/text-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShowBase, useTranslate } from "ra-core";

import { CourseActiveField } from "./CourseActiveField";
import { CourseCreatedAtField } from "./CourseCreatedAtField";
import { CourseDeleteButton } from "./CourseDeleteButton";
import { CoursePageShell } from "./CoursePageShell";
import {
  COURSE_SERVICE_KIND_CHOICES,
  COURSE_TYPE_CHOICES,
} from "./courseModel";

const EMPTY = "—";

const CourseStoresField = () => {
  const translate = useTranslate();
  return (
    <ReferenceArrayField
      reference="stores"
      source="store_ids"
      empty={translate("resources.courses.show.no_stores")}
    >
      <SingleFieldList />
    </ReferenceArrayField>
  );
};

export const CourseShow = () => (
  <ShowBase>
    <CoursePageShell>
      <div className="flex justify-end gap-2 mb-4">
        <EditButton />
        <CourseDeleteButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TextField source="name" />
            <CourseActiveField />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RecordField source="description">
            <TextField source="description" empty={EMPTY} />
          </RecordField>
          <RecordField source="course_type">
            <SelectField
              source="course_type"
              choices={COURSE_TYPE_CHOICES}
              empty={EMPTY}
            />
          </RecordField>
          <RecordField source="service_kind">
            <SelectField
              source="service_kind"
              choices={COURSE_SERVICE_KIND_CHOICES}
              empty={EMPTY}
            />
          </RecordField>
          <RecordField source="duration_minutes">
            <NumberField source="duration_minutes" />
          </RecordField>
          <RecordField source="display_order">
            <NumberField source="display_order" />
          </RecordField>
          <RecordField source="store_ids">
            <CourseStoresField />
          </RecordField>
          <RecordField source="created_at">
            <CourseCreatedAtField />
          </RecordField>
        </CardContent>
      </Card>
    </CoursePageShell>
  </ShowBase>
);

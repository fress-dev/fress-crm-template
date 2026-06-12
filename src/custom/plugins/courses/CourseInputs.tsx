import { AutocompleteArrayInput } from "@/components/admin/autocomplete-array-input";
import { BooleanInput } from "@/components/admin/boolean-input";
import { NumberInput } from "@/components/admin/number-input";
import { ReferenceArrayInput } from "@/components/admin/reference-array-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";
import { useGetList, useRecordContext, useTranslate } from "ra-core";
import { useMemo } from "react";

import type { Course } from "./types";
import {
  cleanupCourseForSave,
  COURSE_SERVICE_KIND_CHOICES,
  COURSE_TYPE_CHOICES,
  validateCourseDescriptionMaxLength,
  validateCourseDisplayOrder,
  validateCourseDuration,
  validateCourseNameMaxLength,
  validateCourseNameRequired,
  validateCourseNameUnique,
} from "./courseModel";
import { useCourseNameUniqueCheck } from "./useCourseNameUniqueCheck";

export { cleanupCourseForSave };

const CourseStoresInput = () => {
  const translate = useTranslate();
  const { data: stores = [], isPending } = useGetList("stores", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "name", order: "ASC" },
    filter: {},
  });

  if (isPending || stores.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          {translate("resources.courses.fields.store_ids")}
        </span>
        <p className="text-sm text-muted-foreground">
          {isPending
            ? translate("ra.message.loading")
            : translate("resources.courses.form.no_stores")}
        </p>
      </div>
    );
  }

  return (
    <ReferenceArrayInput
      source="store_ids"
      reference="stores"
      sort={{ field: "name", order: "ASC" }}
    >
      <AutocompleteArrayInput label="resources.courses.fields.store_ids" />
    </ReferenceArrayInput>
  );
};

export const CourseInputs = () => {
  const record = useRecordContext<Course>();
  const isDuplicate = useCourseNameUniqueCheck(record?.id);

  const validateUniqueName = useMemo(
    () => validateCourseNameUnique(isDuplicate, record?.id, record?.name),
    [isDuplicate, record?.id, record?.name],
  );

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        source="name"
        validate={[
          validateCourseNameRequired,
          validateCourseNameMaxLength,
          validateUniqueName,
        ]}
        helperText={false}
      />
      <TextInput
        source="description"
        multiline
        rows={3}
        validate={validateCourseDescriptionMaxLength}
        helperText={false}
      />
      <SelectInput
        source="course_type"
        choices={COURSE_TYPE_CHOICES}
        helperText={false}
      />
      <SelectInput
        source="service_kind"
        choices={COURSE_SERVICE_KIND_CHOICES}
        helperText={false}
      />
      <NumberInput
        source="duration_minutes"
        min={1}
        max={600}
        step={5}
        validate={validateCourseDuration}
        helperText={false}
      />
      <NumberInput
        source="display_order"
        min={0}
        max={9999}
        step={10}
        validate={validateCourseDisplayOrder}
        helperText={false}
      />
      <CourseStoresInput />
      <BooleanInput source="is_active" helperText={false} />
    </div>
  );
};

import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { BooleanInput } from "@/components/admin/boolean-input";
import { NumberInput } from "@/components/admin/number-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { TextInput } from "@/components/admin/text-input";
import { useGetList, useRecordContext, useTranslate } from "ra-core";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

import {
  cleanupTrainingGroupForSave,
  validateTrainingDescriptionMaxLength,
  validateTrainingDisplayOrder,
  validateTrainingNameMaxLength,
  validateTrainingNameRequired,
  validateTrainingNameUnique,
  validateTrainingTypeRequired,
} from "./trainingContentModel";
import type { TrainingGroup } from "./types";
import { useTrainingGroupNameUniqueCheck } from "./useTrainingNameUniqueCheck";

export { cleanupTrainingGroupForSave };

export const TrainingGroupInputs = () => {
  const translate = useTranslate();
  const record = useRecordContext<TrainingGroup>();
  const trainingTypeId = useWatch({ name: "training_type_id" });

  const { total: typeCount = 0, isPending } = useGetList("training_types", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "name", order: "ASC" },
    filter: {},
  });

  const isDuplicate = useTrainingGroupNameUniqueCheck(
    trainingTypeId ?? record?.training_type_id,
    record?.id,
  );

  const validateUniqueName = useMemo(
    () =>
      validateTrainingNameUnique(
        isDuplicate,
        record?.id,
        record?.name,
        "resources.training_groups.validation.duplicate_name",
      ),
    [isDuplicate, record?.id, record?.name],
  );

  const validators = useMemo(
    () => ({
      nameRequired: validateTrainingNameRequired("training_groups"),
      nameMaxLength: validateTrainingNameMaxLength("training_groups"),
      displayOrder: validateTrainingDisplayOrder("training_groups"),
    }),
    [],
  );

  if (!isPending && typeCount === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {translate("resources.training_groups.form.no_types")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ReferenceInput
        source="training_type_id"
        reference="training_types"
        perPage={100}
        sort={{ field: "display_order", order: "ASC" }}
        isRequired
      >
        <AutocompleteInput
          optionText="name"
          label="resources.training_groups.fields.training_type_id"
          validate={validateTrainingTypeRequired}
          helperText={false}
        />
      </ReferenceInput>
      <TextInput
        source="name"
        label="resources.training_groups.fields.name"
        validate={[
          validators.nameRequired,
          validators.nameMaxLength,
          validateUniqueName,
        ]}
        helperText={false}
      />
      <TextInput
        source="description"
        label="resources.training_groups.fields.description"
        multiline
        rows={3}
        validate={validateTrainingDescriptionMaxLength}
        helperText={false}
      />
      <NumberInput
        source="display_order"
        label="resources.training_groups.fields.display_order"
        min={0}
        max={9999}
        step={10}
        validate={validators.displayOrder}
        helperText={false}
      />
      <BooleanInput
        source="is_active"
        label="resources.training_groups.fields.is_active"
        helperText={false}
      />
    </div>
  );
};

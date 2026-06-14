import { BooleanInput } from "@/components/admin/boolean-input";
import { NumberInput } from "@/components/admin/number-input";
import { TextInput } from "@/components/admin/text-input";
import { useRecordContext } from "ra-core";
import { useMemo } from "react";

import {
  cleanupTrainingTypeForSave,
  validateTrainingDisplayOrder,
  validateTrainingNameMaxLength,
  validateTrainingNameRequired,
  validateTrainingNameUnique,
} from "./trainingContentModel";
import type { TrainingType } from "./types";
import { useTrainingTypeNameUniqueCheck } from "./useTrainingNameUniqueCheck";

export { cleanupTrainingTypeForSave };

export const TrainingTypeInputs = () => {
  const record = useRecordContext<TrainingType>();
  const isDuplicate = useTrainingTypeNameUniqueCheck(record?.id);

  const validateUniqueName = useMemo(
    () =>
      validateTrainingNameUnique(
        isDuplicate,
        record?.id,
        record?.name,
        "resources.training_types.validation.duplicate_name",
      ),
    [isDuplicate, record?.id, record?.name],
  );

  const validators = useMemo(
    () => ({
      nameRequired: validateTrainingNameRequired("training_types"),
      nameMaxLength: validateTrainingNameMaxLength("training_types"),
      displayOrder: validateTrainingDisplayOrder("training_types"),
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        source="name"
        label="resources.training_types.fields.name"
        validate={[
          validators.nameRequired,
          validators.nameMaxLength,
          validateUniqueName,
        ]}
        helperText={false}
      />
      <NumberInput
        source="display_order"
        label="resources.training_types.fields.display_order"
        min={0}
        max={9999}
        step={10}
        validate={validators.displayOrder}
        helperText={false}
      />
      <BooleanInput
        source="is_active"
        label="resources.training_types.fields.is_active"
        helperText={false}
      />
    </div>
  );
};

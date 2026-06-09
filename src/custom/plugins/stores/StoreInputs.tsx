import { useRecordContext } from "ra-core";
import { useMemo } from "react";
import { TextInput } from "@/components/admin/text-input";

import type { Store } from "./types";
import {
  cleanupStoreForSave,
  STORE_ADDRESS_MAX_LENGTH,
  STORE_BUILD_MAX_LENGTH,
  validateStoreAreaCode,
  validateStoreMaxLength,
  validateStoreNameMaxLength,
  validateStoreNameRequired,
  validateStoreNameUnique,
  validateStoreZip,
} from "./storeModel";
import { useStoreNameUniqueCheck } from "./useStoreNameUniqueCheck";

export { cleanupStoreForSave };

export const StoreInputs = () => {
  const record = useRecordContext<Store>();
  const isDuplicate = useStoreNameUniqueCheck(record?.id);

  const validateUniqueName = useMemo(
    () => validateStoreNameUnique(isDuplicate, record?.id),
    [isDuplicate, record?.id],
  );

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        source="name"
        validate={[
          validateStoreNameRequired,
          validateStoreNameMaxLength,
          validateUniqueName,
        ]}
        helperText={false}
      />
      <TextInput
        source="area_code"
        validate={validateStoreAreaCode}
        helperText={false}
      />
      <TextInput source="zip" validate={validateStoreZip} helperText={false} />
      <TextInput
        source="address"
        validate={validateStoreMaxLength(
          STORE_ADDRESS_MAX_LENGTH,
          "resources.stores.validation.address_max_length",
        )}
        helperText={false}
      />
      <TextInput
        source="build"
        validate={validateStoreMaxLength(
          STORE_BUILD_MAX_LENGTH,
          "resources.stores.validation.build_max_length",
        )}
        helperText={false}
      />
    </div>
  );
};

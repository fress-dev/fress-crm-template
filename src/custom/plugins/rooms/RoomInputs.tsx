import { useRecordContext } from "ra-core";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { TextInput } from "@/components/admin/text-input";

import { ACTIVE_STORE_FILTER } from "@/custom/plugins/stores/withStoresDataProvider";

import type { Room } from "./types";
import {
  cleanupRoomForSave,
  validateRoomNameMaxLength,
  validateRoomNameRequired,
  validateRoomNameUnique,
  validateRoomStoreIdRequired,
} from "./roomModel";
import { useRoomNameUniqueCheck } from "./useRoomNameUniqueCheck";

export { cleanupRoomForSave };

export const RoomInputs = () => {
  const record = useRecordContext<Room>();
  const { watch } = useFormContext();
  const storeId = watch("store_id") ?? record?.store_id;
  const isDuplicate = useRoomNameUniqueCheck(record?.id, storeId);

  const validateUniqueName = useMemo(
    () => validateRoomNameUnique(isDuplicate, storeId, record?.id),
    [isDuplicate, storeId, record?.id],
  );

  return (
    <div className="flex flex-col gap-4">
      <ReferenceInput
        source="store_id"
        reference="stores"
        sort={{ field: "name", order: "ASC" }}
        filter={ACTIVE_STORE_FILTER}
      >
        <AutocompleteInput
          optionText="name"
          label="resources.rooms.fields.store_id"
          validate={validateRoomStoreIdRequired}
        />
      </ReferenceInput>
      <TextInput
        source="name"
        validate={[
          validateRoomNameRequired,
          validateRoomNameMaxLength,
          validateUniqueName,
        ]}
        helperText={false}
      />
    </div>
  );
};

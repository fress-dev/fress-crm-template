import { DateInput } from "@/components/admin/date-input";
import { NumberInput } from "@/components/admin/number-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { useTranslate } from "ra-core";

import {
  cleanupMembershipForSave,
  MEMBERSHIP_STATUS_CHOICES,
  validateMembershipContactRequired,
  validateMembershipCourseRequired,
  validateMembershipTicketCount,
} from "./membershipModel";
import { ACTIVE_STORE_FILTER } from "@/custom/plugins/stores/withStoresDataProvider";

export { cleanupMembershipForSave };

export const MembershipInputs = ({ isEdit = false }: { isEdit?: boolean }) => {
  const translate = useTranslate();

  return (
    <div className="flex flex-col gap-4">
      <ReferenceInput
        source="contact_id"
        reference="contacts"
        perPage={10}
        isRequired
      >
        <AutocompleteInput
          optionText={(record) =>
            record
              ? `${record.first_name ?? ""} ${record.last_name ?? ""}`.trim()
              : ""
          }
          label={translate("resources.memberships.fields.contact_id")}
          validate={validateMembershipContactRequired}
        />
      </ReferenceInput>
      <ReferenceInput
        source="course_id"
        reference="courses"
        perPage={25}
        isRequired
        filter={{ is_active: true }}
      >
        <AutocompleteInput
          optionText="name"
          label={translate("resources.memberships.fields.course_id")}
          validate={validateMembershipCourseRequired}
          disabled={isEdit}
        />
      </ReferenceInput>
      {!isEdit ? (
        <NumberInput
          source="ticket_count"
          min={1}
          max={999}
          isRequired
          validate={validateMembershipTicketCount}
        />
      ) : null}
      <ReferenceInput
        source="store_id"
        reference="stores"
        perPage={25}
        filter={ACTIVE_STORE_FILTER}
      >
        <AutocompleteInput
          optionText="name"
          label={translate("resources.memberships.fields.store_id")}
        />
      </ReferenceInput>
      {isEdit ? (
        <SelectInput
          source="status"
          choices={MEMBERSHIP_STATUS_CHOICES}
          isRequired
        />
      ) : null}
      <DateInput source="started_at" />
      <DateInput source="ended_at" />
      <TextInput source="notes" multiline rows={3} />
    </div>
  );
};

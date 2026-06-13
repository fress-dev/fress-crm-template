import { required } from "ra-core";
import { useWatch } from "react-hook-form";
import { DateTimeInput } from "@/components/admin/date-time-input";
import { NumberInput } from "@/components/admin/number-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import type { Sale } from "@/components/atomic-crm/types";
import { ACTIVE_STORE_FILTER } from "@/custom/plugins/stores/withStoresDataProvider";
import type { MembershipTicket } from "@/custom/plugins/memberships/types";

const saleOptionRenderer = (choice: Sale) =>
  `${choice.first_name} ${choice.last_name}`;

const contactOptionRenderer = (choice: {
  first_name?: string;
  last_name?: string;
}) => `${choice.first_name ?? ""} ${choice.last_name ?? ""}`.trim();

const ticketOptionRenderer = (choice: MembershipTicket) =>
  `#${choice.ticket_number}`;

const MembershipTicketInput = () => {
  const contactId = useWatch({ name: "contact_id" });
  const currentTicketId = useWatch({ name: "membership_ticket_id" });

  if (!contactId) {
    return (
      <SelectInput
        source="membership_ticket_id"
        choices={[]}
        disabled
        helperText={false}
        emptyText="resources.session_logs.fields.membership_ticket_id"
      />
    );
  }

  const filter: Record<string, unknown> = {
    contact_id: contactId,
    ...(currentTicketId
      ? {
          "@or": {
            status: "available",
            id: currentTicketId,
          },
        }
      : { status: "available" }),
  };

  return (
    <ReferenceInput
      reference="membership_tickets"
      source="membership_ticket_id"
      filter={filter}
      sort={{ field: "ticket_number", order: "ASC" }}
    >
      <SelectInput
        helperText={false}
        optionText={ticketOptionRenderer}
        emptyText="resources.session_logs.fields.membership_ticket_id"
      />
    </ReferenceInput>
  );
};

export const SessionLogInputs = () => (
  <div className="flex flex-col gap-4">
    <TextInput source="appointment_id" className="hidden" helperText={false} />
    <ReferenceInput
      reference="contacts"
      source="contact_id"
      sort={{ field: "last_name", order: "ASC" }}
    >
      <SelectInput
        helperText={false}
        optionText={contactOptionRenderer}
        validate={required(
          "resources.session_logs.validation.contact_required",
        )}
      />
    </ReferenceInput>
    <ReferenceInput
      reference="sales"
      source="sales_id"
      sort={{ field: "last_name", order: "ASC" }}
      filter={{ "disabled@neq": true }}
    >
      <SelectInput
        helperText={false}
        optionText={saleOptionRenderer}
        validate={required("resources.session_logs.validation.sales_required")}
      />
    </ReferenceInput>
    <ReferenceInput
      reference="stores"
      source="store_id"
      sort={{ field: "name", order: "ASC" }}
      filter={ACTIVE_STORE_FILTER}
    >
      <SelectInput
        helperText={false}
        optionText="name"
        emptyText="resources.session_logs.fields.store_id"
      />
    </ReferenceInput>
    <DateTimeInput
      source="performed_at"
      validate={required(
        "resources.session_logs.validation.performed_at_required",
      )}
    />
    <MembershipTicketInput />
    <NumberInput source="weight_kg" helperText={false} />
    <NumberInput source="body_fat_percent" helperText={false} />
    <NumberInput source="visceral_fat_level" helperText={false} />
    <TextInput source="blood_pressure" helperText={false} />
    <NumberInput source="waist_cm" helperText={false} />
    <NumberInput source="basal_metabolism_kcal" helperText={false} />
    <NumberInput source="muscle_mass_kg" helperText={false} />
    <NumberInput source="body_age" helperText={false} />
    <NumberInput source="body_water_percent" helperText={false} />
    <TextInput source="comment" multiline helperText={false} />
  </div>
);

import { required } from "ra-core";
import { DateTimeInput } from "@/components/admin/date-time-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import type { Sale } from "@/components/atomic-crm/types";
import { ACTIVE_STORE_FILTER } from "@/custom/plugins/stores/withStoresDataProvider";

import { AppointmentRoomInput } from "./AppointmentRoomInput";
import { getAppointmentTypes } from "./appointmentTypes";
import type { Appointment } from "./types";

const saleOptionRenderer = (choice: Sale) =>
  `${choice.first_name} ${choice.last_name}`;

const contactOptionRenderer = (choice: {
  first_name?: string;
  last_name?: string;
}) => `${choice.first_name ?? ""} ${choice.last_name ?? ""}`.trim();

const validateEndAfterStart = (
  value: string | undefined,
  allValues: Partial<Appointment>,
) => {
  if (!value || !allValues.start_at) return undefined;
  if (new Date(value) <= new Date(allValues.start_at)) {
    return "resources.appointments.validation.end_after_start";
  }
  return undefined;
};

export const AppointmentInputs = () => {
  const typeChoices = getAppointmentTypes().map((item) => ({
    id: item.id,
    name: item.label,
  }));

  return (
    <div className="flex flex-col gap-4">
      <ReferenceInput
        reference="contacts"
        source="contact_id"
        sort={{ field: "last_name", order: "ASC" }}
      >
        <SelectInput
          helperText={false}
          optionText={contactOptionRenderer}
          emptyText="resources.appointments.fields.contact_id"
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
          validate={required(
            "resources.appointments.validation.sales_required",
          )}
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
          emptyText="resources.appointments.fields.store_id"
        />
      </ReferenceInput>
      <AppointmentRoomInput />
      <SelectInput
        source="type"
        choices={typeChoices}
        optionText="name"
        optionValue="id"
        defaultValue="session"
        validate={required("resources.appointments.validation.type_required")}
      />
      <DateTimeInput
        source="start_at"
        validate={required("resources.appointments.validation.start_required")}
      />
      <DateTimeInput
        source="end_at"
        validate={[
          required("resources.appointments.validation.end_required"),
          validateEndAfterStart,
        ]}
      />
      <TextInput source="title" multiline helperText={false} />
    </div>
  );
};

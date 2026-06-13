import { useState } from "react";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { DateInput } from "@/components/admin/date-input";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { ReferenceField } from "@/components/admin/reference-field";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SearchInput } from "@/components/admin/search-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextField } from "@/components/admin/text-field";
import { Button } from "@/components/ui/button";
import { useTranslate } from "ra-core";

import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";
import { ACTIVE_STORE_FILTER } from "@/custom/plugins/stores/withStoresDataProvider";

import { AppointmentCalendar } from "./AppointmentCalendar";
import { AppointmentDateTimeField } from "./AppointmentDateTimeField";
import { AppointmentEmpty } from "./AppointmentEmpty";
import { AppointmentTypeField } from "./AppointmentTypeField";
import { getAppointmentTypes } from "./appointmentTypes";
import { isRoomsPluginEnabled } from "@/custom/plugins/rooms/isRoomsPluginEnabled";
import { ACTIVE_ROOM_FILTER } from "@/custom/plugins/rooms/withRoomsDataProvider";

const AppointmentListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.appointments.action.new" />
  </TopToolbar>
);

export const AppointmentList = () => {
  const translate = useTranslate();
  const [view, setView] = useState<"table" | "calendar">("table");
  const typeChoices = getAppointmentTypes().map((item) => ({
    id: item.id,
    name: item.label,
  }));
  const roomsEnabled = isRoomsPluginEnabled();

  const filters = [
    <SearchInput source="q" alwaysOn key="q" />,
    <ReferenceInput source="contact_id" reference="contacts" key="contact_id">
      <AutocompleteInput
        label={false}
        placeholder={translate("resources.appointments.fields.contact_id")}
      />
    </ReferenceInput>,
    <ReferenceInput
      source="sales_id"
      reference="sales"
      filter={{ "disabled@neq": true }}
      key="sales_id"
    >
      <AutocompleteInput
        label={false}
        placeholder={translate("resources.appointments.fields.sales_id")}
      />
    </ReferenceInput>,
    <ReferenceInput
      source="store_id"
      reference="stores"
      filter={ACTIVE_STORE_FILTER}
      key="store_id"
    >
      <AutocompleteInput
        label={false}
        placeholder={translate("resources.appointments.fields.store_id")}
      />
    </ReferenceInput>,
    ...(roomsEnabled
      ? [
          <ReferenceInput
            source="room_id"
            reference="rooms"
            filter={ACTIVE_ROOM_FILTER}
            key="room_id"
          >
            <AutocompleteInput
              label={false}
              placeholder={translate("resources.appointments.fields.room_id")}
            />
          </ReferenceInput>,
        ]
      : []),
    <SelectInput
      source="type"
      key="type"
      label={false}
      emptyText={translate("resources.appointments.fields.type")}
      choices={typeChoices}
      optionText="name"
      optionValue="id"
    />,
    <DateInput
      source="start_at@gte"
      key="start_at@gte"
      label={translate("resources.appointments.fields.start_at")}
    />,
    <DateInput
      source="end_at@lte"
      key="end_at@lte"
      label={translate("resources.appointments.fields.end_at")}
    />,
  ];

  return (
    <List
      filters={filters}
      actions={<AppointmentListActions />}
      sort={{ field: "start_at", order: "DESC" }}
      perPage={50}
      empty={<AppointmentEmpty />}
    >
      <div className="mb-4 flex gap-2">
        <Button
          type="button"
          variant={view === "table" ? "default" : "outline"}
          onClick={() => setView("table")}
        >
          {translate("resources.appointments.views.table")}
        </Button>
        <Button
          type="button"
          variant={view === "calendar" ? "default" : "outline"}
          onClick={() => setView("calendar")}
        >
          {translate("resources.appointments.views.calendar")}
        </Button>
      </div>
      {view === "table" ? (
        <DataTable rowClick="show">
          <DataTable.Col source="start_at">
            <AppointmentDateTimeField source="start_at" />
          </DataTable.Col>
          <DataTable.Col source="end_at">
            <AppointmentDateTimeField source="end_at" />
          </DataTable.Col>
          <DataTable.Col source="type">
            <AppointmentTypeField />
          </DataTable.Col>
          <DataTable.Col source="title" />
          <DataTable.Col source="contact_id">
            <ReferenceField
              source="contact_id"
              reference="contacts"
              link="show"
            >
              <TextField source="last_name" />
            </ReferenceField>
          </DataTable.Col>
          <DataTable.Col source="sales_id">
            <ReferenceField source="sales_id" reference="sales" link="show">
              <TextField source="last_name" />
            </ReferenceField>
          </DataTable.Col>
          <DataTable.Col source="store_id">
            <ReferenceField source="store_id" reference="stores" link="show">
              <TextField source="name" />
            </ReferenceField>
          </DataTable.Col>
          {roomsEnabled ? (
            <DataTable.Col source="room_id">
              <ReferenceField source="room_id" reference="rooms">
                <TextField source="name" empty="—" />
              </ReferenceField>
            </DataTable.Col>
          ) : null}
        </DataTable>
      ) : (
        <AppointmentCalendar />
      )}
    </List>
  );
};

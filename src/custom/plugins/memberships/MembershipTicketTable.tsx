import { DataTable } from "@/components/admin/data-table";
import { DateField } from "@/components/admin/date-field";
import { NumberField } from "@/components/admin/number-field";
import { ReferenceManyField } from "@/components/admin/reference-many-field";
import { SelectField } from "@/components/admin/select-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "ra-core";

import { MEMBERSHIP_TICKET_STATUS_CHOICES } from "./membershipModel";

export const MembershipTicketTable = () => {
  const translate = useTranslate();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>
          {translate("resources.memberships.tickets.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReferenceManyField
          reference="membership_tickets"
          target="membership_id"
          sort={{ field: "ticket_number", order: "ASC" }}
          perPage={500}
        >
          <DataTable bulkActionButtons={false} rowClick={false}>
            <DataTable.Col source="ticket_number">
              <NumberField source="ticket_number" />
            </DataTable.Col>
            <DataTable.Col source="status">
              <SelectField
                source="status"
                choices={[...MEMBERSHIP_TICKET_STATUS_CHOICES]}
              />
            </DataTable.Col>
            <DataTable.Col source="used_at">
              <DateField source="used_at" showTime empty="—" />
            </DataTable.Col>
          </DataTable>
        </ReferenceManyField>
      </CardContent>
    </Card>
  );
};

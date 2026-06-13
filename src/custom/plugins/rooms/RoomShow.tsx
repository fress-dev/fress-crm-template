import { EditButton } from "@/components/admin/edit-button";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { DateField } from "@/components/admin/date-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShowBase } from "ra-core";

import { RoomDeleteButton } from "./RoomDeleteButton";
import { RoomDeletedBadge } from "./RoomDeletedBadge";
import { RoomPageShell } from "./RoomPageShell";

const EMPTY = "—";

export const RoomShow = () => (
  <ShowBase>
    <RoomPageShell>
      <div className="flex justify-end gap-2 mb-4">
        <EditButton />
        <RoomDeleteButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TextField source="name" />
            <RoomDeletedBadge />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RecordField source="store_id">
            <ReferenceField source="store_id" reference="stores" link="show">
              <TextField source="name" empty={EMPTY} />
            </ReferenceField>
          </RecordField>
          <RecordField source="created_at">
            <DateField source="created_at" showTime empty={EMPTY} />
          </RecordField>
          <RecordField source="updated_at">
            <DateField source="updated_at" showTime empty={EMPTY} />
          </RecordField>
        </CardContent>
      </Card>
    </RoomPageShell>
  </ShowBase>
);

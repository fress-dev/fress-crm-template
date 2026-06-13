import { EditBase, Form, useRecordContext } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { FormToolbar } from "@/components/atomic-crm/layout/FormToolbar";
import { cleanupRoomForSave, RoomInputs } from "./RoomInputs";
import { RoomDeleteButton } from "./RoomDeleteButton";
import { RoomDeletedBadge } from "./RoomDeletedBadge";
import { RoomPageShell } from "./RoomPageShell";
import type { Room } from "./types";

const RoomEditDelete = () => {
  const record = useRecordContext<Room>();
  if (record?.del_flg) return null;

  return (
    <div className="flex justify-start pt-2">
      <RoomDeleteButton />
    </div>
  );
};

export const RoomEdit = () => (
  <EditBase actions={false} redirect="show" transform={cleanupRoomForSave}>
    <RoomPageShell>
      <Form className="flex flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <div className="mb-4">
              <RoomDeletedBadge />
            </div>
            <RoomInputs />
            <RoomEditDelete />
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </RoomPageShell>
  </EditBase>
);

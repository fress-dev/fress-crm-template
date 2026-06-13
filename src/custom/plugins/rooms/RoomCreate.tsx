import { CreateBase, Form, useTranslate } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";

import { cleanupRoomForSave, RoomInputs } from "./RoomInputs";
import { RoomPageShell } from "./RoomPageShell";

export const RoomCreate = () => {
  const translate = useTranslate();

  return (
    <CreateBase redirect="show" transform={cleanupRoomForSave}>
      <RoomPageShell>
        <Form>
          <Card>
            <CardContent>
              <RoomInputs />
              <div
                role="toolbar"
                className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
              >
                <CancelButton />
                <SaveButton
                  label={translate("resources.rooms.action.create", {
                    _: "Create Room",
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </Form>
      </RoomPageShell>
    </CreateBase>
  );
};

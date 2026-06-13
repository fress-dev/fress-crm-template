import { CreateButton } from "@/components/admin/create-button";
import { useTranslate } from "ra-core";

import useAppBarHeight from "@/components/atomic-crm/misc/useAppBarHeight";

export const RoomEmpty = () => {
  const appbarHeight = useAppBarHeight();
  const translate = useTranslate();

  return (
    <div
      className="flex flex-col justify-center items-center gap-6"
      style={{ height: `calc(100dvh - ${appbarHeight}px)` }}
    >
      <img
        src="./img/empty.svg"
        alt={translate("resources.rooms.empty.title")}
      />
      <div className="flex flex-col gap-0 items-center">
        <h6 className="text-lg font-bold">
          {translate("resources.rooms.empty.title")}
        </h6>
        <p className="text-sm text-center text-muted-foreground mb-4">
          {translate("resources.rooms.empty.description")}
        </p>
      </div>
      <CreateButton label="resources.rooms.action.create" />
    </div>
  );
};

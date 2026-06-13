import type { PluginResourceProps } from "@/custom/platform/plugin/types";

import { RoomCreate } from "./RoomCreate";
import { RoomEdit } from "./RoomEdit";
import { RoomList } from "./RoomList";
import { RoomShow } from "./RoomShow";
import type { Room } from "./types";

const roomsResource: PluginResourceProps = {
  list: RoomList,
  create: RoomCreate,
  edit: RoomEdit,
  show: RoomShow,
  recordRepresentation: (record) => (record as Room).name,
};

export default roomsResource;

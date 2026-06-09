import type { PluginResourceProps } from "@/custom/platform/plugin/types";

import { StoreCreate } from "./StoreCreate";
import { StoreEdit } from "./StoreEdit";
import { StoreList } from "./StoreList";
import type { Store } from "./types";

const storesResource: PluginResourceProps = {
  list: StoreList,
  create: StoreCreate,
  edit: StoreEdit,
  recordRepresentation: (record) => (record as Store).name,
};

export default storesResource;

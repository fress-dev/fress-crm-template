import type { PluginResourceProps } from "@/custom/platform/plugin/types";

import { StoreCreate } from "./StoreCreate";
import { StoreEdit } from "./StoreEdit";
import { StoreList } from "./StoreList";
import { StoreShow } from "./StoreShow";
import type { Store } from "./types";

const storesResource: PluginResourceProps = {
  list: StoreList,
  create: StoreCreate,
  edit: StoreEdit,
  show: StoreShow,
  recordRepresentation: (record) => (record as Store).name,
};

export default storesResource;

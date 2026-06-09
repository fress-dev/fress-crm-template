import type { PluginDefinition } from "@/custom/platform/plugin/types";

import storesResource from "./resource";

export const storesPlugin: PluginDefinition = {
  id: "stores",
  description: "店舗マスタ",
  migrations: ["20260607120000_stores_plugin.sql"],
  resources: [{ name: "stores", props: storesResource }],
};

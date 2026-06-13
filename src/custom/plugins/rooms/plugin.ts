import type { PluginDefinition } from "@/custom/platform/plugin/types";

import roomsResource from "./resource";

export const roomsPlugin: PluginDefinition = {
  id: "rooms",
  description: "部屋マスタ",
  dependsOn: ["stores"],
  migrations: ["20260614140000_rooms_plugin.sql"],
  resources: [{ name: "rooms", props: roomsResource }],
};

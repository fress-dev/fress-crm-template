import type { PluginDefinition } from "@/custom/platform/plugin/types";

import appointmentsResource from "./resource";

export const appointmentsPlugin: PluginDefinition = {
  id: "appointments",
  description: "予約・スケジュール",
  dependsOn: ["stores", "rooms"],
  migrations: [
    "20260613120000_appointments_plugin.sql",
    "20260614150000_appointments_room_id.sql",
  ],
  resources: [{ name: "appointments", props: appointmentsResource }],
};

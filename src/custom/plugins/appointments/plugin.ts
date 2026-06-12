import type { PluginDefinition } from "@/custom/platform/plugin/types";

import appointmentsResource from "./resource";

export const appointmentsPlugin: PluginDefinition = {
  id: "appointments",
  description: "予約・スケジュール",
  dependsOn: ["stores"],
  migrations: ["20260613120000_appointments_plugin.sql"],
  resources: [{ name: "appointments", props: appointmentsResource }],
};

import type { PluginDefinition } from "@/custom/platform/plugin/types";

import membershipsResource from "./resource";

export const membershipsPlugin: PluginDefinition = {
  id: "memberships",
  description: "契約・回数券",
  dependsOn: ["courses"],
  migrations: ["20260613140000_memberships_plugin.sql"],
  resources: [
    { name: "memberships", props: membershipsResource },
    { name: "membership_tickets", props: {} },
  ],
};

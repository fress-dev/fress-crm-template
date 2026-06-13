import type { PluginDefinition } from "@/custom/platform/plugin/types";

import sessionLogsResource from "./resource";

export const sessionLogPlugin: PluginDefinition = {
  id: "session-log",
  description: "セッション記録",
  dependsOn: ["appointments", "memberships"],
  migrations: ["20260613160000_session_logs_plugin.sql"],
  resources: [{ name: "session_logs", props: sessionLogsResource }],
};

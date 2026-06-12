import type { PluginDefinition } from "@/custom/platform/plugin/types";

import coursesResource from "./resource";

export const coursesPlugin: PluginDefinition = {
  id: "courses",
  description: "コースマスタ",
  dependsOn: ["stores"],
  migrations: ["20260612130000_courses_plugin.sql"],
  resources: [{ name: "courses", props: coursesResource }],
};

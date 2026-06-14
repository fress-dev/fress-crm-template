import type { PluginDefinition } from "@/custom/platform/plugin/types";

import { trainingGroupsResource, trainingTypesResource } from "./resources";

export const trainingContentPlugin: PluginDefinition = {
  id: "training-content",
  description: "種目マスタ（カテゴリ・種目）",
  dependsOn: ["session-log"],
  migrations: ["20260615120000_training_content_plugin.sql"],
  resources: [
    { name: "training_types", props: trainingTypesResource },
    { name: "training_groups", props: trainingGroupsResource },
  ],
};

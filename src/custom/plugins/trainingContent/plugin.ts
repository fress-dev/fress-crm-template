import type { PluginDefinition } from "@/custom/platform/plugin/types";

import { trainingGroupsResource, trainingTypesResource } from "./resources";

export const trainingContentPlugin: PluginDefinition = {
  id: "training-content",
  description: "種目マスタ（カテゴリ・種目）",
  // 種目マスタは単独で成立する（FK 上 session-log を参照しない）。
  // 将来 session-log 側がセッション行で training_groups を参照する際に、
  // session-log の dependsOn へ training-content を加える。
  migrations: ["20260615120000_training_content_plugin.sql"],
  resources: [
    { name: "training_types", props: trainingTypesResource },
    { name: "training_groups", props: trainingGroupsResource },
  ],
};

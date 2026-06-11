import type { Feature } from "./types";

export const buildRequestPrompt = (feature: Feature): string => {
  const lines = [
    `${feature.id} で設計書を書いてください。`,
    "",
    `- Salus: ${feature.salus}`,
    `- CRM: ${feature.crm}`,
    `- 層: ${feature.layer}`,
    `- 優先度: ${feature.priority ?? "—"}`,
    `- シナリオ: ${feature.scenarios.join(", ") || "—"}`,
  ];

  if (feature.depends_on.length > 0) {
    lines.push(`- 依存: ${feature.depends_on.join(", ")}`);
  }
  if (feature.notes) {
    lines.push(`- メモ: ${feature.notes}`);
  }
  if (feature.design) {
    lines.push(`- 設計書: ${feature.design}`);
  }

  lines.push(
    "",
    "手順: docs/workflow/design/_template.md から draft を作成し、approved まで実装しないこと。",
    "参照: docs/product/features.yaml / docs/architecture/plugin-architecture.md",
  );

  return lines.join("\n");
};

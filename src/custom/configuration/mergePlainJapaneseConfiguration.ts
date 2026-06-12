import type { ConfigurationContextValue } from "@/components/atomic-crm/root/ConfigurationContext";
import { defaultConfiguration } from "@/components/atomic-crm/root/defaultConfiguration";
import type { NoteStatus } from "@/components/atomic-crm/types";

import {
  plainJapaneseCompanySectors,
  plainJapaneseConfiguration,
  plainJapaneseDealCategories,
  plainJapaneseDealStages,
  plainJapaneseNoteStatuses,
  plainJapaneseTaskTypes,
} from "./plainJapaneseDefaults";

type LabeledItem = { value: string; label: string };

const applyJapaneseLabels = <T extends LabeledItem>(
  stored: T[] | undefined,
  defaults: T[],
): T[] => {
  if (!stored?.length) {
    return defaults;
  }
  const defaultByValue = new Map(defaults.map((item) => [item.value, item]));
  return stored.map((item) => {
    const ja = defaultByValue.get(item.value);
    return ja ? { ...item, ...ja } : item;
  });
};

const applyJapaneseNoteStatuses = (
  stored: NoteStatus[] | undefined,
): NoteStatus[] => {
  if (!stored?.length) {
    return plainJapaneseNoteStatuses;
  }
  const defaultByValue = new Map(
    plainJapaneseNoteStatuses.map((item) => [item.value, item]),
  );
  return stored.map((item) => {
    const ja = defaultByValue.get(item.value);
    return ja ? { ...item, label: ja.label, color: ja.color } : item;
  });
};

/** 保存済み設定に、日本語ラベルを value 単位で上書きする */
export const mergePlainJapaneseConfiguration = (
  config: Partial<ConfigurationContextValue> = {},
  baseConfig: Partial<ConfigurationContextValue> = plainJapaneseConfiguration,
): ConfigurationContextValue => ({
  ...defaultConfiguration,
  ...plainJapaneseConfiguration,
  ...config,
  ...baseConfig,
  title: baseConfig.title ?? plainJapaneseConfiguration.title,
  currency: baseConfig.currency ?? plainJapaneseConfiguration.currency,
  companySectors: applyJapaneseLabels(
    config.companySectors,
    plainJapaneseCompanySectors,
  ),
  dealStages:
    baseConfig.dealStages ??
    applyJapaneseLabels(config.dealStages, plainJapaneseDealStages),
  dealCategories:
    baseConfig.dealCategories ??
    applyJapaneseLabels(config.dealCategories, plainJapaneseDealCategories),
  dealPipelineStatuses:
    baseConfig.dealPipelineStatuses ??
    config.dealPipelineStatuses ??
    defaultConfiguration.dealPipelineStatuses,
  noteStatuses:
    baseConfig.noteStatuses ?? applyJapaneseNoteStatuses(config.noteStatuses),
  taskTypes:
    baseConfig.taskTypes ??
    applyJapaneseLabels(config.taskTypes, plainJapaneseTaskTypes),
});

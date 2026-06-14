import type { Identifier } from "ra-core";

import type { TrainingGroup, TrainingType } from "./types";

export const TRAINING_NAME_MAX_LENGTH = 80;
export const TRAINING_DESCRIPTION_MAX_LENGTH = 500;
export const TRAINING_DISPLAY_ORDER_MIN = 0;
export const TRAINING_DISPLAY_ORDER_MAX = 9999;

export const normalizeTrainingName = (name: string | undefined): string =>
  (name ?? "").trim();

const normalizeDisplayOrder = (value: number | undefined | null): number =>
  value === undefined || value === null ? 100 : Number(value);

// --- 種目カテゴリ（training_types） ---

export const cleanupTrainingTypeForSave = (
  values: Partial<TrainingType>,
): Partial<TrainingType> => ({
  ...values,
  name: normalizeTrainingName(values.name),
  display_order: normalizeDisplayOrder(values.display_order),
  is_active: values.is_active ?? true,
});

// --- 種目（training_groups） ---

export const cleanupTrainingGroupForSave = (
  values: Partial<TrainingGroup>,
): Partial<TrainingGroup> => ({
  ...values,
  name: normalizeTrainingName(values.name),
  description: values.description?.trim() || undefined,
  display_order: normalizeDisplayOrder(values.display_order),
  is_active: values.is_active ?? true,
});

// --- 共通バリデーション（resource ごとにメッセージキーを切り替えるファクトリ） ---

export type TrainingResource = "training_groups" | "training_types";

export const validateTrainingNameRequired =
  (resource: TrainingResource = "training_groups") =>
  (value: string | undefined) => {
    if (!normalizeTrainingName(value)) {
      return `resources.${resource}.validation.name_required`;
    }
    return undefined;
  };

export const validateTrainingNameMaxLength =
  (resource: TrainingResource = "training_groups") =>
  (value: string | undefined) => {
    if (normalizeTrainingName(value).length > TRAINING_NAME_MAX_LENGTH) {
      return `resources.${resource}.validation.name_max_length`;
    }
    return undefined;
  };

export const validateTrainingDescriptionMaxLength = (
  value: string | undefined,
) => {
  const description = value?.trim();
  if (!description) return undefined;
  if (description.length > TRAINING_DESCRIPTION_MAX_LENGTH) {
    return "resources.training_groups.validation.description_max_length";
  }
  return undefined;
};

export const validateTrainingDisplayOrder =
  (resource: TrainingResource = "training_groups") =>
  (value: number | undefined) => {
    if (value === undefined || value === null || value === ("" as unknown)) {
      return undefined;
    }
    const displayOrder = Number(value);
    if (!Number.isInteger(displayOrder)) {
      return `resources.${resource}.validation.display_order_required`;
    }
    if (
      displayOrder < TRAINING_DISPLAY_ORDER_MIN ||
      displayOrder > TRAINING_DISPLAY_ORDER_MAX
    ) {
      return `resources.${resource}.validation.display_order_range`;
    }
    return undefined;
  };

export const validateTrainingTypeRequired = (value: Identifier | undefined) => {
  if (value === undefined || value === null || value === ("" as unknown)) {
    return "resources.training_groups.validation.training_type_required";
  }
  return undefined;
};

export type TrainingNameUniqueCheck = (
  name: string,
  currentId?: Identifier,
) => Promise<boolean>;

/** 同名（カテゴリ内の重複も含む）があればバリデーションエラーキーを返す */
export const validateTrainingNameUnique =
  (
    isDuplicate: TrainingNameUniqueCheck,
    currentId?: Identifier,
    currentName?: string,
    duplicateMessageKey = "resources.training_groups.validation.duplicate_name",
  ) =>
  async (value: string | undefined) => {
    const name = normalizeTrainingName(value);
    if (!name) return undefined;
    if (
      currentName &&
      normalizeTrainingName(currentName).toLowerCase() === name.toLowerCase()
    ) {
      return undefined;
    }
    const duplicate = await isDuplicate(name, currentId);
    if (duplicate) return duplicateMessageKey;
    return undefined;
  };

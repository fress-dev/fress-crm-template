import { describe, expect, it, vi } from "vitest";

import {
  cleanupTrainingGroupForSave,
  cleanupTrainingTypeForSave,
  validateTrainingDisplayOrder,
  validateTrainingNameRequired,
  validateTrainingNameUnique,
  validateTrainingTypeRequired,
} from "./trainingContentModel";

describe("trainingContentModel", () => {
  it("カテゴリ保存前に文字列と既定値を整える", () => {
    expect(cleanupTrainingTypeForSave({ name: "  胸  " })).toEqual({
      name: "胸",
      display_order: 100,
      is_active: true,
    });
  });

  it("種目保存前に文字列と既定値を整える", () => {
    expect(
      cleanupTrainingGroupForSave({
        training_type_id: 3,
        name: "  ベンチプレス  ",
        description: "  胸の基本種目  ",
      }),
    ).toEqual({
      training_type_id: 3,
      name: "ベンチプレス",
      description: "胸の基本種目",
      display_order: 100,
      is_active: true,
    });
  });

  it("resource ごとに名前必須メッセージを切り替える", () => {
    expect(validateTrainingNameRequired("training_types")("   ")).toBe(
      "resources.training_types.validation.name_required",
    );
    expect(validateTrainingNameRequired("training_groups")("   ")).toBe(
      "resources.training_groups.validation.name_required",
    );
  });

  it("表示順の範囲外を検出する", () => {
    const validate = validateTrainingDisplayOrder("training_groups");
    expect(validate(-1)).toBe(
      "resources.training_groups.validation.display_order_range",
    );
    expect(validate(10000)).toBe(
      "resources.training_groups.validation.display_order_range",
    );
    expect(validate(50)).toBeUndefined();
  });

  it("種目のカテゴリ未選択を検出する", () => {
    expect(validateTrainingTypeRequired(undefined)).toBe(
      "resources.training_groups.validation.training_type_required",
    );
    expect(validateTrainingTypeRequired(2)).toBeUndefined();
  });

  it("同名の重複を検出する", async () => {
    const isDuplicate = vi.fn().mockResolvedValue(true);
    const validate = validateTrainingNameUnique(isDuplicate);
    await expect(validate("ベンチプレス")).resolves.toBe(
      "resources.training_groups.validation.duplicate_name",
    );
    expect(isDuplicate).toHaveBeenCalledWith("ベンチプレス", undefined);
  });

  it("編集時に名前が変わっていなければ重複チェックを省略する", async () => {
    const isDuplicate = vi.fn().mockResolvedValue(true);
    const validate = validateTrainingNameUnique(isDuplicate, 1, "ベンチプレス");
    await expect(validate("ベンチプレス")).resolves.toBeUndefined();
    expect(isDuplicate).not.toHaveBeenCalled();
  });
});

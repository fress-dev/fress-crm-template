import { describe, expect, it, vi } from "vitest";

import {
  cleanupCourseForSave,
  validateCourseDisplayOrder,
  validateCourseDuration,
  validateCourseNameRequired,
  validateCourseNameUnique,
} from "./courseModel";

describe("courseModel", () => {
  it("保存前に文字列と既定値を整える", () => {
    expect(
      cleanupCourseForSave({
        name: "  パーソナル 60分  ",
        description: "  標準コース  ",
        duration_minutes: 60,
      }),
    ).toEqual({
      name: "パーソナル 60分",
      description: "標準コース",
      course_type: "ticket",
      service_kind: "training",
      duration_minutes: 60,
      display_order: 100,
      is_active: true,
      store_ids: [],
    });
  });

  it("コース名の空文字を検出する", () => {
    expect(validateCourseNameRequired("   ")).toBe(
      "resources.courses.validation.name_required",
    );
  });

  it("標準時間の範囲外を検出する", () => {
    expect(validateCourseDuration(0)).toBe(
      "resources.courses.validation.duration_range",
    );
    expect(validateCourseDuration(601)).toBe(
      "resources.courses.validation.duration_range",
    );
  });

  it("表示順の範囲外を検出する", () => {
    expect(validateCourseDisplayOrder(-1)).toBe(
      "resources.courses.validation.display_order_range",
    );
    expect(validateCourseDisplayOrder(10000)).toBe(
      "resources.courses.validation.display_order_range",
    );
  });

  it("同名コースの重複を検出する", async () => {
    const isDuplicate = vi.fn().mockResolvedValue(true);
    const validate = validateCourseNameUnique(isDuplicate);
    await expect(validate("パーソナル 60分")).resolves.toBe(
      "resources.courses.validation.duplicate_name",
    );
    expect(isDuplicate).toHaveBeenCalledWith("パーソナル 60分", undefined);
  });

  it("編集時にコース名が変わっていなければ重複チェックを省略する", async () => {
    const isDuplicate = vi.fn().mockResolvedValue(true);
    const validate = validateCourseNameUnique(
      isDuplicate,
      1,
      "パーソナル 60分",
    );
    await expect(validate("パーソナル 60分")).resolves.toBeUndefined();
    expect(isDuplicate).not.toHaveBeenCalled();
  });
});

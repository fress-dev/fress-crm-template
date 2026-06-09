import { describe, expect, it } from "vitest";

import {
  cleanupStoreForSave,
  normalizeStoreName,
  validateStoreAreaCode,
  validateStoreNameMaxLength,
  validateStoreNameRequired,
  validateStoreZip,
} from "./storeModel";

describe("storeModel", () => {
  it("normalizeStoreName は前後空白を除去する", () => {
    expect(normalizeStoreName("  船橋店  ")).toBe("船橋店");
  });

  it("validateStoreNameRequired は空を拒否する", () => {
    expect(validateStoreNameRequired("   ")).toBe(
      "resources.stores.validation.name_required",
    );
    expect(validateStoreNameRequired("船橋店")).toBeUndefined();
  });

  it("validateStoreNameMaxLength は 50 文字超を拒否する", () => {
    expect(validateStoreNameMaxLength("a".repeat(51))).toBe(
      "resources.stores.validation.name_max_length",
    );
  });

  it("validateStoreZip は任意だが形式不正を拒否する", () => {
    expect(validateStoreZip("")).toBeUndefined();
    expect(validateStoreZip("wq")).toBe(
      "resources.stores.validation.zip_format",
    );
    expect(validateStoreZip("123-4567")).toBeUndefined();
    expect(validateStoreZip("1234567")).toBeUndefined();
  });

  it("validateStoreAreaCode は英数字系のみ許可する", () => {
    expect(validateStoreAreaCode("area-01")).toBeUndefined();
    expect(validateStoreAreaCode("あ")).toBe(
      "resources.stores.validation.area_code_format",
    );
  });

  it("cleanupStoreForSave は文字列フィールドを trim する", () => {
    expect(
      cleanupStoreForSave({
        name: " 船橋店 ",
        zip: " 123-4567 ",
        area_code: "",
      }),
    ).toEqual({
      name: "船橋店",
      zip: "123-4567",
      area_code: undefined,
    });
  });
});

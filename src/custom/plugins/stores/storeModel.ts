import type { Identifier } from "ra-core";

import type { Store } from "./types";

export const STORE_NAME_MAX_LENGTH = 50;
export const STORE_AREA_CODE_MAX_LENGTH = 20;
export const STORE_ADDRESS_MAX_LENGTH = 200;
export const STORE_BUILD_MAX_LENGTH = 100;

const ZIP_PATTERN = /^\d{3}-?\d{4}$/;
const AREA_CODE_PATTERN = /^[A-Za-z0-9_-]*$/;

export const normalizeStoreName = (name: string | undefined): string =>
  (name ?? "").trim();

export const cleanupStoreForSave = (
  values: Partial<Store>,
): Partial<Store> => ({
  ...values,
  name: normalizeStoreName(values.name),
  area_code: values.area_code?.trim() || undefined,
  zip: values.zip?.trim() || undefined,
  address: values.address?.trim() || undefined,
  build: values.build?.trim() || undefined,
});

export const validateStoreNameRequired = (value: string | undefined) => {
  if (!normalizeStoreName(value)) {
    return "resources.stores.validation.name_required";
  }
  return undefined;
};

export const validateStoreNameMaxLength = (value: string | undefined) => {
  const name = normalizeStoreName(value);
  if (name.length > STORE_NAME_MAX_LENGTH) {
    return "resources.stores.validation.name_max_length";
  }
  return undefined;
};

export const validateStoreZip = (value: string | undefined) => {
  const zip = value?.trim();
  if (!zip) return undefined;
  if (!ZIP_PATTERN.test(zip)) {
    return "resources.stores.validation.zip_format";
  }
  return undefined;
};

export const validateStoreAreaCode = (value: string | undefined) => {
  const areaCode = value?.trim();
  if (!areaCode) return undefined;
  if (areaCode.length > STORE_AREA_CODE_MAX_LENGTH) {
    return "resources.stores.validation.area_code_max_length";
  }
  if (!AREA_CODE_PATTERN.test(areaCode)) {
    return "resources.stores.validation.area_code_format";
  }
  return undefined;
};

export const validateStoreMaxLength =
  (max: number, message: string) => (value: string | undefined) => {
    const trimmed = value?.trim();
    if (!trimmed) return undefined;
    if (trimmed.length > max) return message;
    return undefined;
  };

export type StoreNameUniqueCheck = (
  name: string,
  currentId?: Identifier,
) => Promise<boolean>;

/** 同名店舗が既にあればバリデーションエラーキーを返す */
export const validateStoreNameUnique =
  (isDuplicate: StoreNameUniqueCheck, currentId?: Identifier) =>
  async (value: string | undefined) => {
    const name = normalizeStoreName(value);
    if (!name) return undefined;
    const duplicate = await isDuplicate(name, currentId);
    if (duplicate) {
      return "resources.stores.validation.duplicate_name";
    }
    return undefined;
  };

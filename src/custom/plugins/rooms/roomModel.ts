import type { Identifier } from "ra-core";

import type { Room } from "./types";

export const ROOM_NAME_MAX_LENGTH = 50;

export const normalizeRoomName = (name: string | undefined): string =>
  (name ?? "").trim();

export const cleanupRoomForSave = (values: Partial<Room>): Partial<Room> => ({
  ...values,
  name: normalizeRoomName(values.name),
});

export const validateRoomNameRequired = (value: string | undefined) => {
  if (!normalizeRoomName(value)) {
    return "resources.rooms.validation.name_required";
  }
  return undefined;
};

export const validateRoomNameMaxLength = (value: string | undefined) => {
  const name = normalizeRoomName(value);
  if (name.length > ROOM_NAME_MAX_LENGTH) {
    return "resources.rooms.validation.name_max_length";
  }
  return undefined;
};

export const validateRoomStoreIdRequired = (value: unknown) => {
  if (value == null || value === "") {
    return "resources.rooms.validation.store_id_required";
  }
  return undefined;
};

export type RoomNameUniqueCheck = (
  name: string,
  storeId: Identifier | undefined,
  currentId?: Identifier,
) => Promise<boolean>;

/** 同一店舗内に同名の有効部屋があればバリデーションエラーキーを返す */
export const validateRoomNameUnique =
  (
    isDuplicate: RoomNameUniqueCheck,
    storeId: Identifier | undefined,
    currentId?: Identifier,
  ) =>
  async (value: string | undefined) => {
    const name = normalizeRoomName(value);
    if (!name || storeId == null || storeId === "") return undefined;
    const duplicate = await isDuplicate(name, storeId, currentId);
    if (duplicate) {
      return "resources.rooms.validation.duplicate_name";
    }
    return undefined;
  };

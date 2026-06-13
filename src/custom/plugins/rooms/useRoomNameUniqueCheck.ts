import type { DataProvider, Identifier } from "ra-core";
import { useDataProvider } from "ra-core";
import { useCallback } from "react";

import { normalizeRoomName } from "./roomModel";

/** 正規化後の部屋名が同一店舗内の他レコードと重複するか */
export const createRoomNameUniqueCheck =
  (dataProvider: DataProvider) =>
  async (
    name: string,
    storeId: Identifier | undefined,
    currentId?: Identifier,
  ): Promise<boolean> => {
    if (storeId == null || storeId === "") return false;

    const normalized = normalizeRoomName(name);
    if (!normalized) return false;

    const { data } = await dataProvider.getList("rooms", {
      pagination: { page: 1, perPage: 200 },
      sort: { field: "id", order: "ASC" },
      filter: { store_id: storeId },
    });

    const normalizedLower = normalized.toLowerCase();
    return data.some(
      (record) =>
        record.id !== currentId &&
        normalizeRoomName(String(record.name ?? "")).toLowerCase() ===
          normalizedLower,
    );
  };

export const useRoomNameUniqueCheck = (
  currentId?: Identifier,
  storeId?: Identifier,
) => {
  const dataProvider = useDataProvider();
  return useCallback(
    (name: string, storeIdOverride?: Identifier) =>
      createRoomNameUniqueCheck(dataProvider)(
        name,
        storeIdOverride ?? storeId,
        currentId,
      ),
    [currentId, dataProvider, storeId],
  );
};

import type { DataProvider, Identifier } from "ra-core";
import { useDataProvider } from "ra-core";
import { useCallback } from "react";

import { normalizeStoreName } from "./storeModel";

/** 正規化後の店舗名が他レコードと重複するか */
export const createStoreNameUniqueCheck =
  (dataProvider: DataProvider) =>
  async (name: string, currentId?: Identifier): Promise<boolean> => {
    const normalized = normalizeStoreName(name);
    if (!normalized) return false;

    const { data } = await dataProvider.getList("stores", {
      pagination: { page: 1, perPage: 200 },
      sort: { field: "id", order: "ASC" },
      filter: {},
    });

    const normalizedLower = normalized.toLowerCase();
    return data.some(
      (record) =>
        record.id !== currentId &&
        normalizeStoreName(String(record.name ?? "")).toLowerCase() ===
          normalizedLower,
    );
  };

export const useStoreNameUniqueCheck = (currentId?: Identifier) => {
  const dataProvider = useDataProvider();
  return useCallback(
    (name: string) => createStoreNameUniqueCheck(dataProvider)(name, currentId),
    [currentId, dataProvider],
  );
};

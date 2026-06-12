import type { DataProvider, Identifier } from "ra-core";
import { useDataProvider } from "ra-core";
import { useCallback } from "react";

import { normalizeCourseName } from "./courseModel";

/** 正規化後のコース名が他レコードと重複するか */
export const createCourseNameUniqueCheck =
  (dataProvider: DataProvider) =>
  async (name: string, currentId?: Identifier): Promise<boolean> => {
    const normalized = normalizeCourseName(name);
    if (!normalized) return false;
    const { data } = await dataProvider.getList("courses", {
      pagination: { page: 1, perPage: 200 },
      sort: { field: "id", order: "ASC" },
      filter: {},
    });
    const normalizedLower = normalized.toLowerCase();
    return data.some(
      (record) =>
        record.id !== currentId &&
        normalizeCourseName(String(record.name ?? "")).toLowerCase() ===
          normalizedLower,
    );
  };

export const useCourseNameUniqueCheck = (currentId?: Identifier) => {
  const dataProvider = useDataProvider();
  return useCallback(
    (name: string) =>
      createCourseNameUniqueCheck(dataProvider)(name, currentId),
    [currentId, dataProvider],
  );
};

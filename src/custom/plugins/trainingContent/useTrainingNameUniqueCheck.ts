import type { DataProvider, Identifier } from "ra-core";
import { useDataProvider } from "ra-core";
import { useCallback } from "react";

import { normalizeTrainingName } from "./trainingContentModel";

const isSameName = (a: string, b: string): boolean =>
  normalizeTrainingName(a).toLowerCase() ===
  normalizeTrainingName(b).toLowerCase();

/** 正規化後のカテゴリ名が他レコードと重複するか（全体で一意） */
export const createTrainingTypeNameUniqueCheck =
  (dataProvider: DataProvider) =>
  async (name: string, currentId?: Identifier): Promise<boolean> => {
    const normalized = normalizeTrainingName(name);
    if (!normalized) return false;
    const { data } = await dataProvider.getList("training_types", {
      pagination: { page: 1, perPage: 200 },
      sort: { field: "id", order: "ASC" },
      filter: {},
    });
    return data.some(
      (record) =>
        record.id !== currentId &&
        isSameName(String(record.name ?? ""), normalized),
    );
  };

export const useTrainingTypeNameUniqueCheck = (currentId?: Identifier) => {
  const dataProvider = useDataProvider();
  return useCallback(
    (name: string) =>
      createTrainingTypeNameUniqueCheck(dataProvider)(name, currentId),
    [currentId, dataProvider],
  );
};

/** 正規化後の種目名が同一カテゴリ内で重複するか */
export const createTrainingGroupNameUniqueCheck =
  (dataProvider: DataProvider, trainingTypeId: Identifier | undefined) =>
  async (name: string, currentId?: Identifier): Promise<boolean> => {
    const normalized = normalizeTrainingName(name);
    if (
      !normalized ||
      trainingTypeId === undefined ||
      trainingTypeId === null
    ) {
      return false;
    }
    const { data } = await dataProvider.getList("training_groups", {
      pagination: { page: 1, perPage: 200 },
      sort: { field: "id", order: "ASC" },
      filter: { training_type_id: trainingTypeId },
    });
    return data.some(
      (record) =>
        record.id !== currentId &&
        isSameName(String(record.name ?? ""), normalized),
    );
  };

export const useTrainingGroupNameUniqueCheck = (
  trainingTypeId: Identifier | undefined,
  currentId?: Identifier,
) => {
  const dataProvider = useDataProvider();
  return useCallback(
    (name: string) =>
      createTrainingGroupNameUniqueCheck(dataProvider, trainingTypeId)(
        name,
        currentId,
      ),
    [currentId, dataProvider, trainingTypeId],
  );
};

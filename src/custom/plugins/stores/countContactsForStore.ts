import type { DataProvider, Identifier } from "ra-core";

/** 店舗に紐づく会員数（削除可否判定用） */
export const countContactsForStore = async (
  dataProvider: DataProvider,
  storeId: Identifier,
): Promise<number> => {
  const { total } = await dataProvider.getList("contacts", {
    filter: { store_id: storeId },
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
  });

  return total ?? 0;
};

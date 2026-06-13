import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import { applyFullTextSearch } from "@/custom/providers/applyFullTextSearch";

/** 部屋一覧の SearchInput source="q" 用検索カラム */
export const ROOM_SEARCH_COLUMNS = ["name"] as const;

/** 一覧トグル用。dataProvider が解釈して del_flg 条件を外す */
export const ROOMS_INCLUDE_DELETED_FILTER = "include_deleted";

export const applyRoomsActiveFilter = <
  T extends { filter?: Record<string, unknown> },
>(
  params: T,
): T => {
  const filter = params.filter ?? {};
  const { [ROOMS_INCLUDE_DELETED_FILTER]: includeDeleted, ...rest } = filter;

  if (includeDeleted) {
    const { del_flg: _delFlg, q, ...withoutDelFlg } = rest;
    const cleaned =
      q === "" || q == null ? withoutDelFlg : { ...withoutDelFlg, q };
    return { ...params, filter: cleaned };
  }

  if (Object.prototype.hasOwnProperty.call(rest, "del_flg")) {
    return { ...params, filter: rest };
  }

  return { ...params, filter: { ...rest, del_flg: false } };
};

/** rooms リソースの getList 検索・論理削除フィルタ、delete の UPDATE 化 */
export const withRoomsDataProvider = (
  dataProvider: CrmDataProvider,
): CrmDataProvider => {
  const getList = dataProvider.getList.bind(dataProvider);
  const deleteFn = dataProvider.delete.bind(dataProvider);
  const update = dataProvider.update.bind(dataProvider);

  return {
    ...dataProvider,
    getList: (resource, params, ...rest) => {
      if (resource !== "rooms") {
        return getList(resource, params, ...rest);
      }

      const withFilter = applyRoomsActiveFilter(params);
      const withSearch = applyFullTextSearch([...ROOM_SEARCH_COLUMNS])(
        withFilter,
      );

      return getList(resource, withSearch, ...rest);
    },
    delete: (resource, params, ...rest) => {
      if (resource !== "rooms") {
        return deleteFn(resource, params, ...rest);
      }

      const { id, previousData } = params;
      return update(
        resource,
        {
          id,
          data: { del_flg: true },
          previousData,
        },
        ...rest,
      );
    },
  };
};

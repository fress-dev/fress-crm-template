import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import { applyFullTextSearch } from "@/custom/providers/applyFullTextSearch";

/** 予約一覧の SearchInput source="q" 用検索カラム */
export const APPOINTMENT_SEARCH_COLUMNS = ["title"] as const;

export const applyAppointmentsActiveFilter = <
  T extends { filter?: Record<string, unknown> },
>(
  params: T,
): T => {
  const filter = params.filter ?? {};

  if (Object.prototype.hasOwnProperty.call(filter, "del_flg")) {
    return { ...params, filter };
  }

  return { ...params, filter: { ...filter, del_flg: false } };
};

/** appointments リソースの getList 検索・論理削除フィルタ、delete の UPDATE 化 */
export const withAppointmentsDataProvider = (
  dataProvider: CrmDataProvider,
): CrmDataProvider => {
  const getList = dataProvider.getList.bind(dataProvider);
  const deleteFn = dataProvider.delete.bind(dataProvider);
  const update = dataProvider.update.bind(dataProvider);

  return {
    ...dataProvider,
    getList: (resource, params, ...rest) => {
      if (resource !== "appointments") {
        return getList(resource, params, ...rest);
      }

      const withFilter = applyAppointmentsActiveFilter(params);
      const withSearch = applyFullTextSearch([...APPOINTMENT_SEARCH_COLUMNS])(
        withFilter,
      );

      return getList(resource, withSearch, ...rest);
    },
    delete: (resource, params, ...rest) => {
      if (resource !== "appointments") {
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

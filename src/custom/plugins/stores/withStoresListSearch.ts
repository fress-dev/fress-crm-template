import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import { applyFullTextSearch } from "@/custom/providers/applyFullTextSearch";

/** 店舗一覧の SearchInput source="q" 用検索カラム */
export const STORE_SEARCH_COLUMNS = [
  "name",
  "area_code",
  "zip",
  "address",
  "build",
] as const;

/** stores リソースの getList で q フィルタを実カラム検索へ変換する */
export const withStoresListSearch = (
  dataProvider: CrmDataProvider,
): CrmDataProvider => {
  const getList = dataProvider.getList.bind(dataProvider);

  return {
    ...dataProvider,
    getList: (resource, params, ...rest) => {
      if (resource !== "stores") {
        return getList(resource, params, ...rest);
      }

      return getList(
        resource,
        applyFullTextSearch([...STORE_SEARCH_COLUMNS])(params),
        ...rest,
      );
    },
  };
};

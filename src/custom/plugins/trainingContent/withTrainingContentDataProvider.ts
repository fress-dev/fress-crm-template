import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import { applyFullTextSearch } from "@/custom/providers/applyFullTextSearch";

export const TRAINING_GROUP_SEARCH_COLUMNS = ["name", "description"] as const;
export const TRAINING_TYPE_SEARCH_COLUMNS = ["name"] as const;

/** training_groups / training_types の検索（q）を実在カラムへ変換する */
export const withTrainingContentDataProvider = (
  dataProvider: CrmDataProvider,
): CrmDataProvider => {
  const getList = dataProvider.getList.bind(dataProvider);

  return {
    ...dataProvider,
    getList: (resource, params, ...rest) => {
      if (resource === "training_groups") {
        const withSearch = applyFullTextSearch([
          ...TRAINING_GROUP_SEARCH_COLUMNS,
        ])(params);
        return getList(resource, withSearch, ...rest);
      }
      if (resource === "training_types") {
        const withSearch = applyFullTextSearch([
          ...TRAINING_TYPE_SEARCH_COLUMNS,
        ])(params);
        return getList(resource, withSearch, ...rest);
      }
      return getList(resource, params, ...rest);
    },
  };
};

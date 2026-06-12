import type { GetListParams } from "ra-core";

/** SearchInput source="q" を実在カラムの @or @ilike フィルタへ変換する */
export const applyFullTextSearch =
  (columns: string[]) =>
  (params: GetListParams): GetListParams => {
    if (!params.filter?.q) {
      return params;
    }
    const { q, ...filter } = params.filter;
    return {
      ...params,
      filter: {
        ...filter,
        "@or": columns.reduce<Record<string, string>>((acc, column) => {
          if (column === "email") {
            return { ...acc, "email_fts@ilike": q };
          }
          if (column === "phone") {
            return { ...acc, "phone_fts@ilike": q };
          }
          return { ...acc, [`${column}@ilike`]: q };
        }, {}),
      },
    };
  };

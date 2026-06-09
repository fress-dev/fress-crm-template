import { describe, expect, it } from "vitest";

import { applyFullTextSearch } from "./applyFullTextSearch";

describe("applyFullTextSearch", () => {
  it("q がないときは params をそのまま返す", () => {
    const params = {
      filter: { name: "船橋店" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "id", order: "ASC" as const },
    };

    expect(applyFullTextSearch(["name"])(params)).toEqual(params);
  });

  it("q を @or @ilike フィルタへ変換する", () => {
    const params = {
      filter: { q: "船橋" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" as const },
    };

    expect(applyFullTextSearch(["name", "address"])(params)).toEqual({
      ...params,
      filter: {
        "@or": {
          "name@ilike": "船橋",
          "address@ilike": "船橋",
        },
      },
    });
  });
});

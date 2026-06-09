import { describe, expect, it, vi } from "vitest";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

import { withStoresListSearch } from "./withStoresListSearch";

describe("withStoresListSearch", () => {
  it("stores 以外は getList をそのまま委譲する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = { getList } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "船橋" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "id", order: "ASC" as const },
    };

    await withStoresListSearch(dataProvider).getList("contacts", params);

    expect(getList).toHaveBeenCalledWith("contacts", params);
  });

  it("stores は q を name 等の @ilike 検索へ変換する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = { getList } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "船橋" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" as const },
    };

    await withStoresListSearch(dataProvider).getList("stores", params);

    expect(getList).toHaveBeenCalledWith("stores", {
      ...params,
      filter: {
        "@or": {
          "name@ilike": "船橋",
          "area_code@ilike": "船橋",
          "zip@ilike": "船橋",
          "address@ilike": "船橋",
          "build@ilike": "船橋",
        },
      },
    });
  });
});

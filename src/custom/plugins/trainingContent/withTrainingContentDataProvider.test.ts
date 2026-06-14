import { describe, expect, it, vi } from "vitest";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

import { withTrainingContentDataProvider } from "./withTrainingContentDataProvider";

describe("withTrainingContentDataProvider", () => {
  it("training_groups は q を name/description の検索へ変換する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = { getList } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "ベンチ" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "display_order", order: "ASC" as const },
    };
    await withTrainingContentDataProvider(dataProvider).getList(
      "training_groups",
      params,
    );
    expect(getList).toHaveBeenCalledWith("training_groups", {
      ...params,
      filter: {
        "@or": {
          "name@ilike": "ベンチ",
          "description@ilike": "ベンチ",
        },
      },
    });
  });

  it("training_types は q を name の検索へ変換する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = { getList } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "胸" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "display_order", order: "ASC" as const },
    };
    await withTrainingContentDataProvider(dataProvider).getList(
      "training_types",
      params,
    );
    expect(getList).toHaveBeenCalledWith("training_types", {
      ...params,
      filter: { "@or": { "name@ilike": "胸" } },
    });
  });

  it("対象外リソースは素通しする", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = { getList } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "foo" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "id", order: "ASC" as const },
    };
    await withTrainingContentDataProvider(dataProvider).getList(
      "contacts",
      params,
    );
    expect(getList).toHaveBeenCalledWith("contacts", params);
  });
});

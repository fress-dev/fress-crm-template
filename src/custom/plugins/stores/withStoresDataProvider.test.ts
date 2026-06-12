import { describe, expect, it, vi } from "vitest";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

import {
  applyStoresActiveFilter,
  withStoresDataProvider,
} from "./withStoresDataProvider";

describe("applyStoresActiveFilter", () => {
  it("デフォルトで del_flg=false を付与する", () => {
    expect(
      applyStoresActiveFilter({
        filter: { q: "船橋" },
        pagination: { page: 1, perPage: 25 },
        sort: { field: "name", order: "ASC" },
      }),
    ).toEqual({
      filter: { q: "船橋", del_flg: false },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" },
    });
  });

  it("include_deleted 時は del_flg 条件を付けない", () => {
    expect(
      applyStoresActiveFilter({
        filter: { include_deleted: true },
        pagination: { page: 1, perPage: 25 },
        sort: { field: "name", order: "ASC" },
      }),
    ).toEqual({
      filter: {},
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" },
    });
  });

  it("include_deleted 時は del_flg=false が残っていても除去する", () => {
    expect(
      applyStoresActiveFilter({
        filter: { include_deleted: true, del_flg: false },
        pagination: { page: 1, perPage: 25 },
        sort: { field: "name", order: "ASC" },
      }),
    ).toEqual({
      filter: {},
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" },
    });
  });

  it("del_flg が明示されていれば上書きしない", () => {
    expect(
      applyStoresActiveFilter({
        filter: { del_flg: true },
        pagination: { page: 1, perPage: 25 },
        sort: { field: "name", order: "ASC" },
      }),
    ).toEqual({
      filter: { del_flg: true },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" },
    });
  });
});

describe("withStoresDataProvider sales_stores", () => {
  it("getSalesStoreIds / setSalesStoreIds を公開する", () => {
    const base = {
      getList: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    } as unknown as CrmDataProvider;

    const wrapped = withStoresDataProvider(base);

    expect(typeof wrapped.getSalesStoreIds).toBe("function");
    expect(typeof wrapped.setSalesStoreIds).toBe("function");
  });
});

describe("withStoresDataProvider", () => {
  it("stores 以外は getList をそのまま委譲する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = {
      getList,
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "船橋" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "id", order: "ASC" as const },
    };

    await withStoresDataProvider(dataProvider).getList("contacts", params);

    expect(getList).toHaveBeenCalledWith("contacts", params);
  });

  it("stores は q を検索へ変換し del_flg=false を付与する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = {
      getList,
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "船橋" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" as const },
    };

    await withStoresDataProvider(dataProvider).getList("stores", params);

    expect(getList).toHaveBeenCalledWith("stores", {
      ...params,
      filter: {
        del_flg: false,
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

  it("stores の delete は del_flg=true の update になる", async () => {
    const update = vi
      .fn()
      .mockResolvedValue({ data: { id: 1, del_flg: true } });
    const deleteFn = vi.fn();
    const dataProvider = {
      getList: vi.fn(),
      update,
      delete: deleteFn,
    } as unknown as CrmDataProvider;

    const previousData = { id: 1, name: "船橋店", del_flg: false };
    await withStoresDataProvider(dataProvider).delete("stores", {
      id: 1,
      previousData,
    });

    expect(deleteFn).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith("stores", {
      id: 1,
      data: { del_flg: true },
      previousData,
    });
  });

  it("stores 以外の delete はそのまま委譲する", async () => {
    const deleteFn = vi.fn().mockResolvedValue({ data: { id: 1 } });
    const dataProvider = {
      getList: vi.fn(),
      update: vi.fn(),
      delete: deleteFn,
    } as unknown as CrmDataProvider;

    await withStoresDataProvider(dataProvider).delete("contacts", { id: 1 });

    expect(deleteFn).toHaveBeenCalledWith("contacts", { id: 1 });
  });
});

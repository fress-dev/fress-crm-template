import { describe, expect, it, vi } from "vitest";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

import {
  applyRoomsActiveFilter,
  withRoomsDataProvider,
} from "./withRoomsDataProvider";

describe("applyRoomsActiveFilter", () => {
  it("デフォルトで del_flg=false を付与する", () => {
    expect(
      applyRoomsActiveFilter({
        filter: { q: "ルームA" },
        pagination: { page: 1, perPage: 25 },
        sort: { field: "name", order: "ASC" },
      }),
    ).toEqual({
      filter: { q: "ルームA", del_flg: false },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" },
    });
  });

  it("include_deleted 時は del_flg 条件を付けない", () => {
    expect(
      applyRoomsActiveFilter({
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

  it("store_id フィルタは維持する", () => {
    expect(
      applyRoomsActiveFilter({
        filter: { store_id: 1, q: "A" },
        pagination: { page: 1, perPage: 25 },
        sort: { field: "name", order: "ASC" },
      }),
    ).toEqual({
      filter: { store_id: 1, q: "A", del_flg: false },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" },
    });
  });
});

describe("withRoomsDataProvider", () => {
  it("rooms 以外は getList をそのまま委譲する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = {
      getList,
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "ルームA" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "id", order: "ASC" as const },
    };

    await withRoomsDataProvider(dataProvider).getList("stores", params);

    expect(getList).toHaveBeenCalledWith("stores", params);
  });

  it("rooms は q を検索へ変換し del_flg=false を付与する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = {
      getList,
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "ルームA" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" as const },
    };

    await withRoomsDataProvider(dataProvider).getList("rooms", params);

    expect(getList).toHaveBeenCalledWith("rooms", {
      ...params,
      filter: {
        del_flg: false,
        "@or": {
          "name@ilike": "ルームA",
        },
      },
    });
  });

  it("rooms の delete は del_flg=true の update になる", async () => {
    const update = vi
      .fn()
      .mockResolvedValue({ data: { id: 1, del_flg: true } });
    const deleteFn = vi.fn();
    const dataProvider = {
      getList: vi.fn(),
      update,
      delete: deleteFn,
    } as unknown as CrmDataProvider;

    const previousData = { id: 1, name: "ルームA", del_flg: false };
    await withRoomsDataProvider(dataProvider).delete("rooms", {
      id: 1,
      previousData,
    });

    expect(deleteFn).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith("rooms", {
      id: 1,
      data: { del_flg: true },
      previousData,
    });
  });
});

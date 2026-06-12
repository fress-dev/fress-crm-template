import { describe, expect, it, vi } from "vitest";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

import { withCoursesDataProvider } from "./withCoursesDataProvider";

describe("withCoursesDataProvider", () => {
  it("courses は q を検索へ変換する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = {
      getList,
      getOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "60分" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "display_order", order: "ASC" as const },
    };
    await withCoursesDataProvider(dataProvider).getList("courses", params);
    expect(getList).toHaveBeenCalledWith("courses", {
      ...params,
      filter: {
        "@or": {
          "name@ilike": "60分",
          "description@ilike": "60分",
          "course_type@ilike": "60分",
          "service_kind@ilike": "60分",
        },
      },
    });
  });

  it("getOne で course_stores から store_ids を付与する", async () => {
    const getOne = vi
      .fn()
      .mockResolvedValue({ data: { id: 1, name: "パーソナル 60分" } });
    const getList = vi.fn().mockResolvedValue({
      data: [
        { id: 10, course_id: 1, store_id: 2 },
        { id: 11, course_id: 1, store_id: 3 },
      ],
      total: 2,
    });
    const dataProvider = {
      getList,
      getOne,
      create: vi.fn(),
      update: vi.fn(),
    } as unknown as CrmDataProvider;
    const result = await withCoursesDataProvider(dataProvider).getOne(
      "courses",
      { id: 1 },
    );
    expect(result.data).toEqual({
      id: 1,
      name: "パーソナル 60分",
      store_ids: [2, 3],
    });
  });

  it("create は courses と course_stores に分けて保存する", async () => {
    const create = vi
      .fn()
      .mockResolvedValueOnce({ data: { id: 1, name: "パーソナル 60分" } })
      .mockResolvedValue({ data: { id: 100 } });
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = {
      getList,
      getOne: vi.fn(),
      create,
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CrmDataProvider;
    const result = await withCoursesDataProvider(dataProvider).create(
      "courses",
      {
        data: {
          name: "パーソナル 60分",
          duration_minutes: 60,
          store_ids: [2, 3],
        },
      },
    );
    expect(create).toHaveBeenNthCalledWith(1, "courses", {
      data: { name: "パーソナル 60分", duration_minutes: 60 },
    });
    expect(create).toHaveBeenNthCalledWith(2, "course_stores", {
      data: { course_id: 1, store_id: 2 },
    });
    expect(create).toHaveBeenNthCalledWith(3, "course_stores", {
      data: { course_id: 1, store_id: 3 },
    });
    expect(result.data.store_ids).toEqual([2, 3]);
  });

  it("update は course_stores の差分を同期する", async () => {
    const update = vi
      .fn()
      .mockResolvedValue({ data: { id: 1, name: "パーソナル 60分" } });
    const create = vi.fn().mockResolvedValue({ data: { id: 101 } });
    const deleteFn = vi.fn().mockResolvedValue({ data: { id: 10 } });
    const getList = vi.fn().mockResolvedValue({
      data: [
        { id: 10, course_id: 1, store_id: 2 },
        { id: 11, course_id: 1, store_id: 3 },
      ],
      total: 2,
    });
    const dataProvider = {
      getList,
      getOne: vi.fn(),
      create,
      update,
      delete: deleteFn,
    } as unknown as CrmDataProvider;

    const result = await withCoursesDataProvider(dataProvider).update(
      "courses",
      {
        id: 1,
        data: { name: "パーソナル 60分", store_ids: [3, 4] },
        previousData: {
          id: 1,
          name: "パーソナル 60分",
          store_ids: [2, 3],
        },
      },
    );

    expect(update).toHaveBeenCalledWith("courses", {
      id: 1,
      data: { name: "パーソナル 60分" },
      previousData: { id: 1, name: "パーソナル 60分" },
    });
    expect(deleteFn).toHaveBeenCalledWith("course_stores", {
      id: 10,
      previousData: { id: 10, course_id: 1, store_id: 2 },
    });
    expect(create).toHaveBeenCalledWith("course_stores", {
      data: { course_id: 1, store_id: 4 },
    });
    expect(create).not.toHaveBeenCalledWith("course_stores", {
      data: { course_id: 1, store_id: 3 },
    });
    expect(result.data.store_ids).toEqual([3, 4]);
  });
});

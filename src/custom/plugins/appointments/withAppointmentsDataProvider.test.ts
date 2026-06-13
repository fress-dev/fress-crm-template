import { describe, expect, it, vi } from "vitest";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

import {
  applyAppointmentsActiveFilter,
  withAppointmentsDataProvider,
} from "./withAppointmentsDataProvider";

describe("applyAppointmentsActiveFilter", () => {
  it("デフォルトで del_flg=false を付与する", () => {
    expect(
      applyAppointmentsActiveFilter({
        filter: { type: "session" },
        pagination: { page: 1, perPage: 25 },
        sort: { field: "start_at", order: "DESC" },
      }),
    ).toEqual({
      filter: { type: "session", del_flg: false },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "start_at", order: "DESC" },
    });
  });

  it("del_flg が明示されていれば上書きしない", () => {
    expect(
      applyAppointmentsActiveFilter({
        filter: { del_flg: true },
        pagination: { page: 1, perPage: 25 },
        sort: { field: "start_at", order: "DESC" },
      }),
    ).toEqual({
      filter: { del_flg: true },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "start_at", order: "DESC" },
    });
  });
});

describe("withAppointmentsDataProvider", () => {
  it("appointments 以外は getList をそのまま委譲する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = {
      getList,
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CrmDataProvider;
    const params = {
      filter: { q: "体験" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "id", order: "ASC" as const },
    };

    await withAppointmentsDataProvider(dataProvider).getList(
      "contacts",
      params,
    );

    expect(getList).toHaveBeenCalledWith("contacts", params);
  });

  it("getList(appointments) は del_flg=false と title 検索を付与する", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = {
      getList,
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CrmDataProvider;

    await withAppointmentsDataProvider(dataProvider).getList("appointments", {
      filter: { q: "体験" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "start_at", order: "DESC" },
    });

    expect(getList).toHaveBeenCalledWith("appointments", {
      filter: {
        del_flg: false,
        "@or": { "title@ilike": "体験" },
      },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "start_at", order: "DESC" },
    });
  });

  it("delete(appointments) は update({ del_flg: true }) に委譲する", async () => {
    const update = vi.fn().mockResolvedValue({ data: { id: 1 } });
    const dataProvider = {
      getList: vi.fn(),
      update,
      delete: vi.fn(),
    } as unknown as CrmDataProvider;
    const previousData = { id: 1, del_flg: false };

    await withAppointmentsDataProvider(dataProvider).delete("appointments", {
      id: 1,
      previousData,
    });

    expect(update).toHaveBeenCalledWith("appointments", {
      id: 1,
      data: { del_flg: true },
      previousData,
    });
  });
});

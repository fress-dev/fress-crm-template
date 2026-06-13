import { describe, expect, it, vi } from "vitest";
import type { DataProvider } from "ra-core";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

import type { MembershipTicket } from "@/custom/plugins/memberships/types";

import type { SessionLog } from "./types";
import {
  applySessionLogsActiveFilter,
  applySessionLogsSearch,
  withSessionLogsDataProvider,
} from "./withSessionLogsDataProvider";

const sessionLog: SessionLog = {
  id: 1,
  contact_id: 10,
  sales_id: 20,
  store_id: 30,
  membership_ticket_id: 100,
  performed_at: "2026-06-13T10:00:00.000Z",
  del_flg: false,
  created_at: "2026-06-13T10:00:00.000Z",
};

const availableTicket: MembershipTicket = {
  id: 100,
  membership_id: 1,
  contact_id: 10,
  ticket_number: 1,
  status: "available",
  created_at: "2026-06-13T00:00:00.000Z",
};

const buildDataProvider = (
  overrides: Partial<DataProvider> = {},
): DataProvider =>
  ({
    getList: vi.fn(async () => ({ data: [], total: 0 })),
    getOne: vi.fn(async (_resource, params) => ({
      data:
        params.id === availableTicket.id
          ? availableTicket
          : { ...sessionLog, id: params.id },
    })),
    getMany: vi.fn(async () => ({ data: [] })),
    getManyReference: vi.fn(async () => ({ data: [], total: 0 })),
    create: vi.fn(async (_resource, params) => ({
      data: { ...sessionLog, ...(params.data as object), id: 1 },
    })),
    update: vi.fn(async (_resource, params) => ({
      data: { ...sessionLog, ...(params.data as object) },
    })),
    delete: vi.fn(async () => ({ data: sessionLog })),
    deleteMany: vi.fn(async () => ({ data: [] })),
    updateMany: vi.fn(async () => ({ data: [] })),
    ...overrides,
  }) as DataProvider;

describe("applySessionLogsActiveFilter", () => {
  it("デフォルトで del_flg=false を付与する", () => {
    expect(
      applySessionLogsActiveFilter({
        filter: { contact_id: 1 },
        pagination: { page: 1, perPage: 25 },
        sort: { field: "performed_at", order: "DESC" },
      }),
    ).toEqual({
      filter: { contact_id: 1, del_flg: false },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "performed_at", order: "DESC" },
    });
  });
});

describe("applySessionLogsSearch", () => {
  it("q を会員名検索とコメント検索に変換する", async () => {
    const dataProvider = buildDataProvider({
      getList: vi.fn(async (resource) =>
        resource === "contacts"
          ? { data: [{ id: 10 }], total: 1 }
          : { data: [], total: 0 },
      ) as DataProvider["getList"],
    });

    const result = await applySessionLogsSearch(dataProvider, {
      filter: { q: "会員" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "performed_at", order: "DESC" },
    });

    expect(result.filter).toEqual({
      "@or": {
        "comment@ilike": "会員",
        "contact_id@in": [10],
      },
    });
  });
});

describe("withSessionLogsDataProvider", () => {
  it("create 時に available チケットを used に更新する", async () => {
    const base = buildDataProvider();
    const update = vi.spyOn(base, "update");
    const wrapped = withSessionLogsDataProvider(base as CrmDataProvider);

    await wrapped.create("session_logs", {
      data: {
        contact_id: 10,
        sales_id: 20,
        performed_at: "2026-06-13T10:00:00.000Z",
        membership_ticket_id: 100,
      },
    });

    expect(update).toHaveBeenCalledWith(
      "membership_tickets",
      expect.objectContaining({
        id: 100,
        data: {
          status: "used",
          used_at: "2026-06-13T10:00:00.000Z",
        },
      }),
    );
  });

  it("used チケット選択時は create を拒否する", async () => {
    const usedTicket: MembershipTicket = {
      ...availableTicket,
      status: "used",
    };
    const base = buildDataProvider({
      getOne: vi.fn(async () => ({
        data: usedTicket,
      })) as DataProvider["getOne"],
    });
    const wrapped = withSessionLogsDataProvider(base as CrmDataProvider);

    await expect(
      wrapped.create("session_logs", {
        data: {
          contact_id: 10,
          sales_id: 20,
          performed_at: "2026-06-13T10:00:00.000Z",
          membership_ticket_id: 100,
        },
      }),
    ).rejects.toThrow("resources.session_logs.error.ticket_not_available");
  });

  it("delete(session_logs) は update({ del_flg: true }) に委譲する", async () => {
    const update = vi.fn().mockResolvedValue({ data: sessionLog });
    const base = buildDataProvider({ update });
    const wrapped = withSessionLogsDataProvider(base as CrmDataProvider);

    await wrapped.delete("session_logs", {
      id: 1,
      previousData: sessionLog,
    });

    expect(update).toHaveBeenCalledWith("session_logs", {
      id: 1,
      data: { del_flg: true },
      previousData: sessionLog,
    });
  });
});

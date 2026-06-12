import { describe, expect, it, vi } from "vitest";
import type { DataProvider } from "ra-core";

import { withMembershipsDataProvider } from "./withMembershipsDataProvider";
import type { Membership, MembershipTicket } from "./types";

const membership: Membership = {
  id: 1,
  contact_id: 10,
  course_id: 20,
  store_id: 30,
  ticket_count: 3,
  status: "active",
  created_at: "2026-06-13T00:00:00.000Z",
  updated_at: "2026-06-13T00:00:00.000Z",
};

const buildDataProvider = (
  overrides: Partial<DataProvider> = {},
): DataProvider =>
  ({
    getList: vi.fn(async () => ({ data: [], total: 0 })),
    getOne: vi.fn(async () => ({ data: membership })),
    getMany: vi.fn(async () => ({ data: [] })),
    getManyReference: vi.fn(async () => ({ data: [], total: 0 })),
    create: vi.fn(async (_resource, params) => ({
      data: { ...membership, ...(params.data as object) },
    })),
    update: vi.fn(async (_resource, params) => ({
      data: { ...membership, ...(params.data as object) },
    })),
    delete: vi.fn(async () => ({ data: membership })),
    deleteMany: vi.fn(async () => ({ data: [] })),
    updateMany: vi.fn(async () => ({ data: [] })),
    ...overrides,
  }) as DataProvider;

describe("withMembershipsDataProvider", () => {
  it("creates membership tickets on create", async () => {
    const base = buildDataProvider();
    const create = vi.spyOn(base, "create");
    const wrapped = withMembershipsDataProvider(base as never);

    await wrapped.create("memberships", {
      data: {
        contact_id: 10,
        course_id: 20,
        ticket_count: 3,
      },
    });

    expect(create).toHaveBeenCalledTimes(4);
    expect(create).toHaveBeenNthCalledWith(
      2,
      "membership_tickets",
      expect.objectContaining({
        data: expect.objectContaining({
          membership_id: 1,
          contact_id: 10,
          ticket_number: 1,
          status: "available",
        }),
      }),
    );
    expect(create).toHaveBeenNthCalledWith(
      4,
      "membership_tickets",
      expect.objectContaining({
        data: expect.objectContaining({ ticket_number: 3 }),
      }),
    );
  });

  it("rejects delete when locked tickets exist", async () => {
    const tickets: MembershipTicket[] = [
      {
        id: 1,
        membership_id: 1,
        contact_id: 10,
        ticket_number: 1,
        status: "used",
        created_at: "2026-06-13T00:00:00.000Z",
      },
    ];
    const base = buildDataProvider({
      getList: vi.fn(async (resource) =>
        resource === "membership_tickets"
          ? { data: tickets, total: tickets.length }
          : { data: [], total: 0 },
      ) as DataProvider["getList"],
    });
    const wrapped = withMembershipsDataProvider(base as never);

    await expect(
      wrapped.delete("memberships", { id: 1, previousData: membership }),
    ).rejects.toThrow("resources.memberships.error.delete_locked_tickets");
  });

  it("deletes tickets before membership when all are available", async () => {
    const tickets: MembershipTicket[] = [
      {
        id: 1,
        membership_id: 1,
        contact_id: 10,
        ticket_number: 1,
        status: "available",
        created_at: "2026-06-13T00:00:00.000Z",
      },
    ];
    const base = buildDataProvider({
      getList: vi.fn(async (resource) =>
        resource === "membership_tickets"
          ? { data: tickets, total: tickets.length }
          : { data: [], total: 0 },
      ) as DataProvider["getList"],
    });
    const deleteOne = vi.spyOn(base, "delete");
    const wrapped = withMembershipsDataProvider(base as never);

    await wrapped.delete("memberships", { id: 1, previousData: membership });

    expect(deleteOne).toHaveBeenCalledWith("membership_tickets", {
      id: 1,
      previousData: tickets[0],
    });
    expect(deleteOne).toHaveBeenCalledWith("memberships", {
      id: 1,
      previousData: membership,
    });
  });
});

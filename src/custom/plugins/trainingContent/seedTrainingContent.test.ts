import type { DataProvider } from "ra-core";
import { describe, expect, it, vi } from "vitest";

import { seedTrainingContentFromTenant } from "./seedTrainingContent";

describe("seedTrainingContentFromTenant", () => {
  it("seed が無ければスキップする", async () => {
    const dataProvider = {
      getList: vi.fn(),
      create: vi.fn(),
    } as unknown as DataProvider;
    const result = await seedTrainingContentFromTenant(dataProvider, undefined);
    expect(result).toEqual({ seededTypes: 0, seededGroups: 0, skipped: true });
    expect(dataProvider.getList).not.toHaveBeenCalled();
  });

  it("既存データがあればスキップする", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 3 });
    const create = vi.fn();
    const dataProvider = { getList, create } as unknown as DataProvider;
    const result = await seedTrainingContentFromTenant(dataProvider, [
      { name: "胸", groups: [{ name: "ベンチプレス" }] },
    ]);
    expect(result.skipped).toBe(true);
    expect(create).not.toHaveBeenCalled();
  });

  it("カテゴリと種目を作成し、種目は作成済みカテゴリ id に紐づける", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const create = vi
      .fn()
      .mockResolvedValueOnce({ data: { id: 11, name: "胸" } })
      .mockResolvedValue({ data: { id: 100 } });
    const dataProvider = { getList, create } as unknown as DataProvider;

    const result = await seedTrainingContentFromTenant(dataProvider, [
      {
        name: "胸",
        displayOrder: 10,
        groups: [
          { name: "ベンチプレス", displayOrder: 10 },
          { name: "チェストプレス", displayOrder: 20 },
        ],
      },
    ]);

    expect(create).toHaveBeenNthCalledWith(1, "training_types", {
      data: { name: "胸", display_order: 10, is_active: true },
    });
    expect(create).toHaveBeenNthCalledWith(2, "training_groups", {
      data: {
        training_type_id: 11,
        name: "ベンチプレス",
        description: undefined,
        display_order: 10,
        is_active: true,
      },
    });
    expect(create).toHaveBeenNthCalledWith(3, "training_groups", {
      data: {
        training_type_id: 11,
        name: "チェストプレス",
        description: undefined,
        display_order: 20,
        is_active: true,
      },
    });
    expect(result).toEqual({
      seededTypes: 1,
      seededGroups: 2,
      skipped: false,
    });
  });
});

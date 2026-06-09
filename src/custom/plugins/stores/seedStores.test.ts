import type { DataProvider } from "ra-core";
import { describe, expect, it, vi } from "vitest";

import { seedStoresFromTenant } from "./seedStores";

const createDataProvider = (total: number): DataProvider =>
  ({
    getList: vi.fn().mockResolvedValue({ data: [], total }),
    create: vi.fn().mockResolvedValue({ data: { id: 1 } }),
  }) as unknown as DataProvider;

describe("seedStoresFromTenant", () => {
  it("storeSeed が空ならスキップする", async () => {
    const dataProvider = createDataProvider(0);

    const result = await seedStoresFromTenant(dataProvider, []);

    expect(result).toEqual({ seeded: 0, skipped: true });
    expect(dataProvider.getList).not.toHaveBeenCalled();
  });

  it("既存店舗があれば投入しない", async () => {
    const dataProvider = createDataProvider(2);

    const result = await seedStoresFromTenant(dataProvider, [
      { name: "船橋店" },
    ]);

    expect(result).toEqual({ seeded: 0, skipped: true });
    expect(dataProvider.create).not.toHaveBeenCalled();
  });

  it("空テーブルなら storeSeed を投入する", async () => {
    const dataProvider = createDataProvider(0);

    const result = await seedStoresFromTenant(dataProvider, [
      { name: "船橋店" },
      { name: "千葉店" },
    ]);

    expect(result).toEqual({ seeded: 2, skipped: false });
    expect(dataProvider.create).toHaveBeenCalledTimes(2);
    expect(dataProvider.create).toHaveBeenCalledWith("stores", {
      data: { name: "船橋店" },
    });
  });
});

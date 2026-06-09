import { describe, expect, it, vi, beforeEach } from "vitest";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

import { withPluginDataProvider } from "./withPluginDataProvider";

const loadTenantConfig = vi.fn();
const getPlugin = vi.fn();

vi.mock("@/custom/platform/tenant/loadTenantConfig", () => ({
  loadTenantConfig: () => loadTenantConfig(),
}));

vi.mock("@/custom/platform/plugin/registry", () => ({
  getPlugin: (id: string) => getPlugin(id),
}));

describe("withPluginDataProvider", () => {
  beforeEach(() => {
    loadTenantConfig.mockReset();
    getPlugin.mockReset();
  });

  it("stores 無効時は dataProvider をそのまま返す", () => {
    loadTenantConfig.mockReturnValue({ plugins: [] });
    getPlugin.mockReturnValue(undefined);

    const dataProvider = { getList: vi.fn() } as unknown as CrmDataProvider;
    const wrapped = withPluginDataProvider(dataProvider);

    expect(wrapped).toBe(dataProvider);
  });

  it("stores 有効時は getList をラップする", async () => {
    loadTenantConfig.mockReturnValue({ plugins: ["stores"] });
    getPlugin.mockReturnValue({ id: "stores" });

    const getList = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const dataProvider = { getList } as unknown as CrmDataProvider;
    const wrapped = withPluginDataProvider(dataProvider);

    expect(wrapped).not.toBe(dataProvider);

    await wrapped.getList("stores", {
      filter: { q: "船橋" },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" },
    });

    expect(getList).toHaveBeenCalledWith("stores", {
      filter: {
        "@or": expect.objectContaining({ "name@ilike": "船橋" }),
      },
      pagination: { page: 1, perPage: 25 },
      sort: { field: "name", order: "ASC" },
    });
  });
});

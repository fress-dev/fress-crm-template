import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearPluginRegistryForTesting,
  getEnabledPlugins,
  getPlugin,
  registerPlugin,
} from "./registry";

describe("plugin registry", () => {
  afterEach(() => {
    clearPluginRegistryForTesting();
    vi.restoreAllMocks();
  });

  it("registerPlugin で取得できる", () => {
    registerPlugin({ id: "stores", description: "店舗マスタ" });
    expect(getPlugin("stores")?.description).toBe("店舗マスタ");
  });

  it("重複登録は上書きしない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    registerPlugin({ id: "stores", description: "first" });
    registerPlugin({ id: "stores", description: "second" });
    expect(getPlugin("stores")?.description).toBe("first");
    expect(warn).toHaveBeenCalled();
  });

  it("getEnabledPlugins はテナントの plugins だけ返す", () => {
    registerPlugin({ id: "stores" });
    registerPlugin({ id: "appointments" });
    const enabled = getEnabledPlugins(["stores"], { warnUnknown: false });
    expect(enabled.map((p) => p.id)).toEqual(["stores"]);
  });

  it("未知の plugin id は warn してスキップする", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const enabled = getEnabledPlugins(["missing-plugin"]);
    expect(enabled).toEqual([]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("missing-plugin"),
    );
  });

  it("dependsOn の順でソートする", () => {
    registerPlugin({ id: "appointments", dependsOn: ["stores"] });
    registerPlugin({ id: "stores" });
    const enabled = getEnabledPlugins(["appointments", "stores"], {
      warnUnknown: false,
    });
    expect(enabled.map((p) => p.id)).toEqual(["stores", "appointments"]);
  });
});

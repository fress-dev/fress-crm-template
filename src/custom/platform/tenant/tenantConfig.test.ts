import { afterEach, describe, expect, it, vi } from "vitest";

import { loadTenantConfig } from "./loadTenantConfig";
import { toCrmConfiguration } from "./toCrmConfiguration";
import { toI18nOverrides } from "./toI18nOverrides";

describe("tenant config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("VITE_TENANT_ID 未指定なら default を読み込む", () => {
    vi.stubEnv("VITE_TENANT_ID", undefined);

    const tenant = loadTenantConfig();

    expect(tenant.id).toBe("default");
    expect(tenant.title).toBe("お客様管理");
  });

  it("VITE_TENANT_ID で noexcuse を読み込む", () => {
    vi.stubEnv("VITE_TENANT_ID", "noexcuse");

    const tenant = loadTenantConfig();

    expect(tenant.id).toBe("noexcuse");
    expect(tenant.title).toBe("noexcuse CRM");
    expect(tenant.hiddenResources).toContain("companies");
  });

  it("未知のテナントは default にフォールバックする", () => {
    vi.stubEnv("VITE_TENANT_ID", "missing");
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const tenant = loadTenantConfig();

    expect(tenant.id).toBe("default");
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("missing"),
    );
  });

  it("tenant crm 設定を CRM props に変換する", () => {
    vi.stubEnv("VITE_TENANT_ID", "noexcuse");

    const config = toCrmConfiguration(loadTenantConfig());

    expect(config.title).toBe("noexcuse CRM");
    expect(config.currency).toBe("JPY");
    expect(config.dealStages?.map((stage) => stage.value)).toEqual([
      "applied",
      "trial-booked",
      "trial-done",
      "considering",
      "joined",
      "churned",
    ]);
    expect(config.dealPipelineStatuses).toEqual(["joined"]);
  });

  it("tenant labels を i18n 上書きに変換する", () => {
    vi.stubEnv("VITE_TENANT_ID", "noexcuse");

    const messages = toI18nOverrides(loadTenantConfig());

    expect(messages).toMatchObject({
      resources: {
        contacts: { name: "会員 |||| 会員", forcedCaseName: "会員" },
        deals: { name: "入会管理 |||| 入会管理" },
        sales: { name: "スタッフ |||| スタッフ" },
      },
    });
  });
});

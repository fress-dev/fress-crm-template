import type { TenantConfig } from "./types";

const DEFAULT_TENANT_ID = "default";

const tenantModules = import.meta.glob("../../../../tenants/*.json", {
  eager: true,
  import: "default",
}) as Record<string, TenantConfig>;

const findTenantModule = (tenantId: string): TenantConfig | undefined => {
  const suffix = `/${tenantId}.json`;
  const key = Object.keys(tenantModules).find((path) => path.endsWith(suffix));
  return key ? tenantModules[key] : undefined;
};

const fallbackTenantConfig = (): TenantConfig => ({
  id: DEFAULT_TENANT_ID,
  plugins: [],
  extensions: [],
});

/** ビルド時にバンドルされた tenants/*.json から設定を読み込む */
export const loadTenantConfig = (): TenantConfig => {
  const tenantId = import.meta.env.VITE_TENANT_ID ?? DEFAULT_TENANT_ID;
  const config = findTenantModule(tenantId);

  if (!config) {
    if (import.meta.env.DEV) {
      console.warn(
        `[tenant] 未知の VITE_TENANT_ID="${tenantId}"。default を使用します。`,
      );
    }
    return findTenantModule(DEFAULT_TENANT_ID) ?? fallbackTenantConfig();
  }

  return {
    ...config,
    plugins: config.plugins ?? [],
    extensions: config.extensions ?? [],
  };
};

import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";
import { getPlugin } from "@/custom/platform/plugin/registry";

/** テナント設定とレジストリの両方で stores が有効か */
export const isStoresPluginEnabled = (): boolean => {
  const tenant = loadTenantConfig();
  return tenant.plugins.includes("stores") && Boolean(getPlugin("stores"));
};

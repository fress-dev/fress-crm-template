import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";
import { getPlugin } from "@/custom/platform/plugin/registry";

/** テナント設定とレジストリの両方で rooms が有効か */
export const isRoomsPluginEnabled = (): boolean => {
  const tenant = loadTenantConfig();
  return tenant.plugins.includes("rooms") && Boolean(getPlugin("rooms"));
};

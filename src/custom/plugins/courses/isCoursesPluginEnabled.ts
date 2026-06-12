import { getPlugin } from "@/custom/platform/plugin/registry";
import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";

/** テナント設定とレジストリの両方で courses が有効か */
export const isCoursesPluginEnabled = (): boolean => {
  const tenant = loadTenantConfig();
  return tenant.plugins.includes("courses") && Boolean(getPlugin("courses"));
};

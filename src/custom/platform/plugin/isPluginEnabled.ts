import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";

import { getPlugin } from "./registry";

/** テナント設定とレジストリの両方で指定プラグインが有効か */
export const isPluginEnabled = (pluginId: string): boolean => {
  const tenant = loadTenantConfig();
  return tenant.plugins.includes(pluginId) && Boolean(getPlugin(pluginId));
};

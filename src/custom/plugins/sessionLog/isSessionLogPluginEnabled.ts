import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";
import { getPlugin } from "@/custom/platform/plugin/registry";

/** session-log プラグインが有効か */
export const isSessionLogPluginEnabled = (): boolean => {
  const tenant = loadTenantConfig();
  return (
    tenant.plugins.includes("session-log") && Boolean(getPlugin("session-log"))
  );
};

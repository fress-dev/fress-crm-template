import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";

/** memberships プラグインが有効か */
export const isMembershipsPluginEnabled = (): boolean => {
  const tenant = loadTenantConfig();
  return tenant.plugins.includes("memberships");
};

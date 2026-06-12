import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";
import { getPlugin } from "@/custom/platform/plugin/registry";

/** テナント設定とレジストリの両方で appointments が有効か */
export const isAppointmentsPluginEnabled = (): boolean => {
  const tenant = loadTenantConfig();
  return (
    tenant.plugins.includes("appointments") &&
    Boolean(getPlugin("appointments"))
  );
};

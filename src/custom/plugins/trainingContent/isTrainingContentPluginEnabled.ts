import { getPlugin } from "@/custom/platform/plugin/registry";
import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";

/** テナント設定とレジストリの両方で training-content が有効か */
export const isTrainingContentPluginEnabled = (): boolean => {
  const tenant = loadTenantConfig();
  return (
    tenant.plugins.includes("training-content") &&
    Boolean(getPlugin("training-content"))
  );
};

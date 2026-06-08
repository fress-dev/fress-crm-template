import type { ConfigurationContextValue } from "@/components/atomic-crm/root/ConfigurationContext";
import { plainJapaneseConfiguration } from "@/custom/configuration/plainJapaneseDefaults";

import { loadTenantConfig } from "../tenant/loadTenantConfig";
import type { TenantConfig } from "../tenant/types";
import { bootstrapPlugins } from "./bootstrapPlugins";
import { getEnabledPlugins } from "./registry";
import type { PluginDefinition } from "./types";

export type AppAssembly = {
  tenant: TenantConfig;
  enabledPlugins: PluginDefinition[];
  /** platform-tenant-config まで plainJapanese を既定とする */
  crmConfiguration: Partial<ConfigurationContextValue>;
};

let bootstrapped = false;

const ensureBootstrapped = (): void => {
  if (bootstrapped) return;
  bootstrapPlugins();
  bootstrapped = true;
};

/** テナント設定と有効プラグインを解決し、App へ渡す props を組み立てる */
export const resolveAppAssembly = (): AppAssembly => {
  ensureBootstrapped();
  const tenant = loadTenantConfig();
  const enabledPlugins = getEnabledPlugins(tenant.plugins);

  return {
    tenant,
    enabledPlugins,
    crmConfiguration: plainJapaneseConfiguration,
  };
};

/** 単体テスト用 — bootstrap 状態をリセット */
export const resetAssemblyBootstrapForTesting = (): void => {
  bootstrapped = false;
};

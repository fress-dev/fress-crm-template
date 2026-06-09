import type { ConfigurationContextValue } from "@/components/atomic-crm/root/ConfigurationContext";
import { loadTenantConfig } from "../tenant/loadTenantConfig";
import { toCrmConfiguration } from "../tenant/toCrmConfiguration";
import { toI18nOverrides } from "../tenant/toI18nOverrides";
import type { TenantConfig } from "../tenant/types";
import { bootstrapPlugins } from "./bootstrapPlugins";
import { getEnabledPlugins } from "./registry";
import type { PluginDefinition } from "./types";

export type AppAssembly = {
  tenant: TenantConfig;
  enabledPlugins: PluginDefinition[];
  crmConfiguration: Partial<ConfigurationContextValue>;
  i18nOverrides: Record<string, unknown>;
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
    crmConfiguration: toCrmConfiguration(tenant),
    i18nOverrides: toI18nOverrides(tenant),
  };
};

/** 単体テスト用 — bootstrap 状態をリセット */
export const resetAssemblyBootstrapForTesting = (): void => {
  bootstrapped = false;
};

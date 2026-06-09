import { useEffect, useMemo, useRef } from "react";
import { useStore } from "ra-core";

import {
  CONFIGURATION_STORE_KEY,
  useConfigurationUpdater,
  type ConfigurationContextValue,
} from "@/components/atomic-crm/root/ConfigurationContext";

import { mergePlainJapaneseConfiguration } from "./mergePlainJapaneseConfiguration";
import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";
import { toCrmConfiguration } from "@/custom/platform/tenant/toCrmConfiguration";

/**
 * Layout 経由で DB 設定が store に入ったあと、日本語ラベルを再適用する。
 * （ログイン後に英語設定で上書きされるのを防ぐ）
 */
export const PlainJapaneseConfigurationSync = () => {
  const [config] = useStore<ConfigurationContextValue>(CONFIGURATION_STORE_KEY);
  const updateConfiguration = useConfigurationUpdater();
  const lastSerialized = useRef<string>("");
  const tenantConfiguration = useMemo(
    () => toCrmConfiguration(loadTenantConfig()),
    [],
  );

  useEffect(() => {
    const merged = mergePlainJapaneseConfiguration(config, tenantConfiguration);
    const serialized = JSON.stringify(merged);
    if (serialized === lastSerialized.current) {
      return;
    }
    lastSerialized.current = serialized;
    updateConfiguration(merged);
  }, [config, tenantConfiguration, updateConfiguration]);

  return null;
};

import type { ConfigurationContextValue } from "@/components/atomic-crm/root/ConfigurationContext";
import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

import { mergePlainJapaneseConfiguration } from "@/custom/configuration/mergePlainJapaneseConfiguration";

/** DB から読み込んだ設定にも日本語ラベルを適用する */
export const withPlainJapaneseConfiguration = (
  dataProvider: CrmDataProvider,
  tenantConfiguration?: Partial<ConfigurationContextValue>,
): CrmDataProvider => ({
  ...dataProvider,
  async getConfiguration(): Promise<ConfigurationContextValue> {
    const config = await dataProvider.getConfiguration();
    return mergePlainJapaneseConfiguration(config, tenantConfiguration);
  },
  async updateConfiguration(
    config: ConfigurationContextValue,
  ): Promise<ConfigurationContextValue> {
    const merged = mergePlainJapaneseConfiguration(config, tenantConfiguration);
    return dataProvider.updateConfiguration(merged);
  },
});

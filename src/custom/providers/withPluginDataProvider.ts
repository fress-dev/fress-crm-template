import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import { isStoresPluginEnabled } from "@/custom/plugins/stores/isStoresPluginEnabled";
import { withStoresListSearch } from "@/custom/plugins/stores/withStoresListSearch";

/** 有効プラグイン向けの dataProvider 拡張を合成する（無効時は素通し） */
export const withPluginDataProvider = (
  dataProvider: CrmDataProvider,
): CrmDataProvider => {
  if (!isStoresPluginEnabled()) {
    return dataProvider;
  }
  return withStoresListSearch(dataProvider);
};

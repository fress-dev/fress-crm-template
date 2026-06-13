import type { Identifier } from "ra-core";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";

/** stores プラグインが dataProvider に追加するメソッド */
export type StoresDataProviderExtensions = {
  getSalesStoreIds: (salesId: Identifier) => Promise<number[]>;
  setSalesStoreIds: (salesId: Identifier, storeIds: number[]) => Promise<void>;
};

export type StoresDataProvider = CrmDataProvider & StoresDataProviderExtensions;

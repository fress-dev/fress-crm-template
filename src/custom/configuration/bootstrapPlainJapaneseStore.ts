import type { Store } from "ra-core";

import { CONFIGURATION_STORE_KEY } from "@/components/atomic-crm/root/ConfigurationContext";

import { mergePlainJapaneseConfiguration } from "./mergePlainJapaneseConfiguration";

/** localStorage に残った英語設定を、起動時に日本語へ差し替える */
export const bootstrapPlainJapaneseStore = (store: Store): void => {
  const stored = store.getItem<Record<string, unknown>>(
    CONFIGURATION_STORE_KEY,
  );
  store.setItem(
    CONFIGURATION_STORE_KEY,
    mergePlainJapaneseConfiguration(stored ?? {}),
  );
};

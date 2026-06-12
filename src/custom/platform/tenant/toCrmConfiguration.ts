import type { ConfigurationContextValue } from "@/components/atomic-crm/root/ConfigurationContext";
import { plainJapaneseConfiguration } from "@/custom/configuration/plainJapaneseDefaults";

import type { TenantConfig } from "./types";

/** テナント JSON の CRM 設定を FressCRM に渡す設定へ変換する */
export const toCrmConfiguration = (
  tenant: TenantConfig,
): Partial<ConfigurationContextValue> => ({
  ...plainJapaneseConfiguration,
  title: tenant.title || plainJapaneseConfiguration.title,
  currency: tenant.crm?.currency ?? plainJapaneseConfiguration.currency,
  dealStages: tenant.crm?.dealStages ?? plainJapaneseConfiguration.dealStages,
  dealCategories:
    tenant.crm?.dealCategories ?? plainJapaneseConfiguration.dealCategories,
  dealPipelineStatuses:
    tenant.crm?.dealPipelineStatuses ??
    plainJapaneseConfiguration.dealPipelineStatuses,
  noteStatuses:
    tenant.crm?.noteStatuses ?? plainJapaneseConfiguration.noteStatuses,
  taskTypes: tenant.crm?.taskTypes ?? plainJapaneseConfiguration.taskTypes,
});

import type { PluginDefinition } from "@/custom/platform/plugin/types";

import storesResource from "./resource";

export const storesPlugin: PluginDefinition = {
  id: "stores",
  description: "店舗マスタ",
  migrations: [
    "20260607120000_stores_plugin.sql",
    "20260609120000_stores_validation.sql",
    "20260609140000_contacts_summary_store_id.sql",
    "20260610120000_stores_store_id_nullable.sql",
    "20260612120000_stores_soft_delete.sql",
    "20260613150000_stores_sales_scope.sql",
  ],
  resources: [{ name: "stores", props: storesResource }],
};

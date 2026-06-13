import coreSales from "@/components/atomic-crm/sales";

import { SalesEdit } from "./SalesEdit";

/** stores プラグイン有効時 — スタッフ編集に担当店舗 UI を追加 */
const salesResource = {
  ...coreSales,
  edit: SalesEdit,
};

export default salesResource;

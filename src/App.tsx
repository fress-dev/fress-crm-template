import { localStorageStore } from "ra-core";
import { useMemo } from "react";

import { FressCRM } from "@/custom/root/FressCRM";
import { getDataProvider } from "@/components/atomic-crm/providers/supabase";

import { bootstrapPlainJapaneseStore } from "@/custom/configuration/bootstrapPlainJapaneseStore";
import { PlainJapaneseLayout } from "@/custom/layout/PlainJapaneseLayout";
import { i18nProvider } from "@/custom/i18n/i18nProvider";
import { withPlainJapaneseConfiguration } from "@/custom/providers/withPlainJapaneseConfiguration";
import { resolveAppAssembly } from "@/custom/platform/plugin/resolveAssembly";

const crmStore = localStorageStore(undefined, "CRM");
bootstrapPlainJapaneseStore(crmStore);

/**
 * アプリケーションのエントリポイント
 *
 * 日本語化は custom 層から注入（コア非変更）:
 * - i18nProvider … 画面文言
 * - resolveAppAssembly … テナント・有効プラグイン・CRM 設定の組み立て
 * - bootstrap + dataProvider ラップ … 保存済み英語設定の上書き
 */
const App = () => {
  const assembly = useMemo(() => resolveAppAssembly(), []);

  const dataProvider = useMemo(
    () => withPlainJapaneseConfiguration(getDataProvider()),
    [],
  );

  return (
    <FressCRM
      store={crmStore}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      layout={PlainJapaneseLayout}
      {...assembly.crmConfiguration}
    />
  );
};

export default App;

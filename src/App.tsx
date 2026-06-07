import { localStorageStore } from "ra-core";
import { useMemo } from "react";

import { CRM } from "@/components/atomic-crm/root/CRM";
import { getDataProvider } from "@/components/atomic-crm/providers/supabase";

import { bootstrapPlainJapaneseStore } from "@/custom/configuration/bootstrapPlainJapaneseStore";
import { plainJapaneseConfiguration } from "@/custom/configuration/plainJapaneseDefaults";
import { PlainJapaneseLayout } from "@/custom/layout/PlainJapaneseLayout";
import { i18nProvider } from "@/custom/i18n/i18nProvider";
import { withPlainJapaneseConfiguration } from "@/custom/providers/withPlainJapaneseConfiguration";

const crmStore = localStorageStore(undefined, "CRM");
bootstrapPlainJapaneseStore(crmStore);

/**
 * アプリケーションのエントリポイント
 *
 * 日本語化は custom 層から注入（コア非変更）:
 * - i18nProvider … 画面文言
 * - plainJapaneseConfiguration … 見込み・商談段階などの表示名
 * - bootstrap + dataProvider ラップ … 保存済み英語設定の上書き
 */
const App = () => {
  const dataProvider = useMemo(
    () => withPlainJapaneseConfiguration(getDataProvider()),
    [],
  );

  return (
    <CRM
      store={crmStore}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      layout={PlainJapaneseLayout}
      {...plainJapaneseConfiguration}
    />
  );
};

export default App;

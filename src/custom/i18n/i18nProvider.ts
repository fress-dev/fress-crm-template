import { mergeTranslations } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import japaneseMessages from "@bicstone/ra-language-japanese";
import englishMessages from "ra-language-english";
import { raSupabaseEnglishMessages } from "ra-supabase-language-english";
import { englishCrmMessages } from "@/components/atomic-crm/providers/commons/englishCrmMessages";

import { coursesPluginI18n } from "@/custom/plugins/courses/i18n";
import { membershipsPluginI18n } from "@/custom/plugins/memberships/i18n";
import { storesPluginI18n } from "@/custom/plugins/stores/i18n";

import { japaneseCrmMessages } from "./japaneseCrmMessages";

/** Supabase 認証まわり（公式の日本語パッケージがないため custom で上書き） */
const raSupabaseJapaneseMessagesOverride = {
  "ra-supabase": {
    auth: {
      password_reset:
        "パスワード再設定用のメールをお送りしました。メールをご確認ください。",
      forgot_password: "パスワードをお忘れですか？",
      forgot_password_details:
        "登録したメールアドレスを入力してください。再設定の手順をお送りします。",
    },
  },
};

/** react-admin 共通文言のうち、より平易な表現に差し替える部分 */
const raPlainJapaneseOverride = {
  ra: {
    action: {
      clear_input_value: "入力を消す",
      export: "書き出す",
      import: "取り込む",
      open_menu: "その他",
      search: "探す",
      show: "詳細を見る",
    },
    auth: {
      sign_in: "ログイン",
      sign_in_error: "ログインできませんでした",
      logout: "ログアウト",
      password: "パスワード",
      username: "メールアドレス",
    },
    navigation: {
      clear_filters: "絞り込みを解除",
      no_filtered_results: "条件に合う%{name}はありません。",
      no_results: "%{name}はありません。",
    },
    page: {
      empty: "まだデータがありません",
      invite: "新しく登録してみてください",
    },
    notification: {
      updated: "更新しました",
      created: "登録しました",
      deleted: "削除しました",
    },
  },
};

const englishCatalog = mergeTranslations(
  englishMessages,
  raSupabaseEnglishMessages,
  englishCrmMessages,
);

const japaneseCatalog = mergeTranslations(
  englishCatalog,
  japaneseMessages,
  raSupabaseJapaneseMessagesOverride,
  raPlainJapaneseOverride,
  japaneseCrmMessages,
  storesPluginI18n,
  coursesPluginI18n,
  membershipsPluginI18n,
);

/** 本プロジェクトのデフォルトは日本語。ブラウザが en のときのみ英語を初期表示。 */
export const getInitialLocale = (): "ja" | "en" => {
  if (typeof navigator === "undefined") {
    return "ja";
  }
  const browserLocale = navigator.languages?.[0] ?? navigator.language;
  if (browserLocale?.toLowerCase().startsWith("en")) {
    return "en";
  }
  return "ja";
};

export const createI18nProvider = (tenantMessages = {}) =>
  polyglotI18nProvider(
    (locale) => {
      if (locale === "ja") {
        return mergeTranslations(japaneseCatalog, tenantMessages);
      }
      return englishCatalog;
    },
    getInitialLocale(),
    [
      { locale: "ja", name: "日本語" },
      { locale: "en", name: "English" },
    ],
    { allowMissing: true },
  );

export const i18nProvider = createI18nProvider();

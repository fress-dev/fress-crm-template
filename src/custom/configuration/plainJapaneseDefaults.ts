import type { ConfigurationContextValue } from "@/components/atomic-crm/root/ConfigurationContext";
import {
  defaultDarkModeLogo,
  defaultDealPipelineStatuses,
  defaultLightModeLogo,
} from "@/components/atomic-crm/root/defaultConfiguration";

/**
 * 50〜60代でも直感的に読める日本語ラベル。
 * value は DB 互換のため英語のまま、label のみ平易な日本語にする。
 */
export const plainJapaneseCompanySectors = [
  { value: "communication-services", label: "通信・メディア" },
  { value: "consumer-discretionary", label: "一般消費財・サービス" },
  { value: "consumer-staples", label: "生活必需品" },
  { value: "energy", label: "エネルギー" },
  { value: "financials", label: "金融" },
  { value: "health-care", label: "医療・ヘルスケア" },
  { value: "industrials", label: "製造・インフラ" },
  { value: "information-technology", label: "情報技術（IT）" },
  { value: "materials", label: "素材・化学" },
  { value: "real-estate", label: "不動産" },
  { value: "utilities", label: "公益事業（電気・ガス・水道など）" },
];

export const plainJapaneseDealStages = [
  { value: "opportunity", label: "新規案件" },
  { value: "proposal-sent", label: "見積もり送付済み" },
  { value: "in-negociation", label: "交渉中" },
  { value: "won", label: "成約" },
  { value: "lost", label: "失注" },
  { value: "delayed", label: "保留" },
];

export const plainJapaneseDealCategories = [
  { value: "other", label: "その他" },
  { value: "copywriting", label: "文章作成" },
  { value: "print-project", label: "印刷物" },
  { value: "ui-design", label: "画面デザイン" },
  { value: "website-design", label: "ホームページ制作" },
];

export const plainJapaneseNoteStatuses = [
  { value: "cold", label: "見込み薄い", color: "#7dbde8" },
  { value: "warm", label: "検討中", color: "#e8cb7d" },
  { value: "hot", label: "有力", color: "#e88b7d" },
  { value: "in-contract", label: "契約中", color: "#a4e87d" },
];

export const plainJapaneseTaskTypes = [
  { value: "none", label: "なし" },
  { value: "email", label: "メール" },
  { value: "demo", label: "商品・サービスの説明" },
  { value: "lunch", label: "会食" },
  { value: "meeting", label: "打ち合わせ" },
  { value: "follow-up", label: "再度の連絡" },
  { value: "thank-you", label: "お礼" },
  { value: "ship", label: "発送" },
  { value: "call", label: "電話" },
];

/** CRM コンポーネントへ渡す設定一式 */
export const plainJapaneseConfiguration = {
  title: "お客様管理",
  currency: "JPY",
  companySectors: plainJapaneseCompanySectors,
  dealStages: plainJapaneseDealStages,
  dealCategories: plainJapaneseDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  noteStatuses: plainJapaneseNoteStatuses,
  taskTypes: plainJapaneseTaskTypes,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
} satisfies Partial<ConfigurationContextValue>;

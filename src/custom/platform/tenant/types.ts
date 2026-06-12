/** 初回セットアップ用の店舗シード（運用開始後は管理画面で編集） */
export type StoreSeedEntry = {
  name: string;
  area_code?: string;
  zip?: string;
  address?: string;
  build?: string;
};

/** 初回セットアップ用のコースシード（運用開始後は管理画面で編集） */
export type CourseSeedEntry = {
  name: string;
  description?: string;
  courseType: "single" | "membership" | "ticket";
  serviceKind: "training" | "stretch" | "training_and_stretch";
  durationMinutes: number;
  storeNames?: string[];
  displayOrder?: number;
  isActive?: boolean;
};

type LabeledValueConfig = {
  value: string;
  label: string;
};

type NoteStatusConfig = LabeledValueConfig & {
  color: string;
};

export type HiddenResource = "companies" | "contacts" | "deals" | "sales";

export type TenantLabels = {
  contacts: string;
  deals: string;
  sales: string;
  companies?: string;
};

export type TenantCrmConfig = {
  dealStages?: LabeledValueConfig[];
  dealCategories?: LabeledValueConfig[];
  noteStatuses?: NoteStatusConfig[];
  taskTypes?: LabeledValueConfig[];
  dealPipelineStatuses?: string[];
  currency?: string;
};

/** テナント設定。現状は `tenants/*.json` からビルド時に読み込む */
export type TenantConfig = {
  id: string;
  title: string;
  plugins: string[];
  hiddenResources?: HiddenResource[];
  crm?: TenantCrmConfig;
  labels?: TenantLabels;
  extensions?: string[];
  /** stores プラグイン有効時の初回店舗データ */
  storeSeed?: StoreSeedEntry[];
  /** courses プラグイン有効時の初回コースデータ */
  courseSeed?: CourseSeedEntry[];
};

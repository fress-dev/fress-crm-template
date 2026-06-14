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

/** 初回セットアップ用の種目シード（運用開始後は管理画面で編集） */
export type TrainingGroupSeedEntry = {
  name: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
};

/** 初回セットアップ用の種目カテゴリ（部位）シード */
export type TrainingTypeSeedEntry = {
  name: string;
  displayOrder?: number;
  isActive?: boolean;
  groups?: TrainingGroupSeedEntry[];
};

type LabeledValueConfig = {
  value: string;
  label: string;
};

type NoteStatusConfig = LabeledValueConfig & {
  color: string;
};

export type AppointmentTypeConfig = {
  id: string;
  label: string;
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
  /** appointments プラグイン有効時の予約種別 */
  appointmentTypes?: AppointmentTypeConfig[];
  /** training-content プラグイン有効時の初回種目データ */
  trainingContentSeed?: TrainingTypeSeedEntry[];
};

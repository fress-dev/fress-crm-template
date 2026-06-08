/** 初回セットアップ用の店舗シード（運用開始後は管理画面で編集） */
export type StoreSeedEntry = {
  name: string;
  area_code?: string;
  zip?: string;
  address?: string;
  build?: string;
};

/**
 * テナント設定の最小型（platform-plugin-registry 時点）。
 * 表示名・商談段階等は platform-tenant-config PR で拡張する。
 */
export type TenantConfig = {
  id: string;
  plugins: string[];
  extensions?: string[];
  /** stores プラグイン有効時の初回店舗データ */
  storeSeed?: StoreSeedEntry[];
};

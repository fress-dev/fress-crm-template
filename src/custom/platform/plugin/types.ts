/** プラグイン定義。業務画面・ルートは将来 PR で routes / resources を実装する */
export type PluginDefinition = {
  id: string;
  description?: string;
  dependsOn?: string[];
  /** 将来: React Router のルート定義 */
  routes?: unknown;
  /** 将来: react-admin Resource 定義 */
  resources?: unknown;
  /** 将来: Supabase migration ファイル名の一覧 */
  migrations?: string[];
};

/** プラグイン実行時に渡すコンテキスト（将来拡張） */
export type PluginContext = {
  tenantId: string;
};

/**
 * テナント固有の差し込み口。
 * tenant.extensions のモジュールが実装する（dynamic import は将来 PR）。
 */
export type TenantExtension = {
  id: string;
  onAppointmentCreated?: (payload: unknown) => Promise<void>;
};

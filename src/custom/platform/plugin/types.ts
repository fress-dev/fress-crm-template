import type { ComponentType } from "react";

/** react-admin Resource に渡す画面コンポーネント */
export type PluginResourceProps = {
  list?: ComponentType;
  create?: ComponentType;
  edit?: ComponentType;
  show?: ComponentType;
  recordRepresentation?: (record: Record<string, unknown>) => string;
};

export type PluginResourceDefinition = {
  name: string;
  props: PluginResourceProps;
};

/** プラグイン定義 */
export type PluginDefinition = {
  id: string;
  description?: string;
  dependsOn?: string[];
  /** 将来: React Router のルート定義 */
  routes?: unknown;
  /** react-admin Resource 定義 */
  resources?: PluginResourceDefinition[];
  /** Supabase migration ファイル名の一覧 */
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

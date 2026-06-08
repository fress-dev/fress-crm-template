/**
 * テナント設定の最小型（platform-plugin-registry 時点）。
 * 表示名・商談段階等は platform-tenant-config PR で拡張する。
 */
export type TenantConfig = {
  id: string;
  plugins: string[];
  extensions?: string[];
};

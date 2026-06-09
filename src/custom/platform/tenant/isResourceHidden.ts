import type { HiddenResource, TenantConfig } from "./types";

/** テナント設定で非表示にするリソースか判定する */
export const isResourceHidden = (
  tenant: TenantConfig,
  resource: HiddenResource,
): boolean => tenant.hiddenResources?.includes(resource) ?? false;

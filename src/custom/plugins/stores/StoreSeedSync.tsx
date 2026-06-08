import { useDataProvider, useGetIdentity } from "ra-core";
import { useEffect, useRef } from "react";

import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";

import { isStoresPluginEnabled } from "./isStoresPluginEnabled";
import { seedStoresFromTenant } from "./seedStores";

/** ログイン後にテナントの storeSeed を一度だけ投入する */
export const StoreSeedSync = () => {
  const dataProvider = useDataProvider();
  const { identity } = useGetIdentity();
  const seededRef = useRef(false);

  useEffect(() => {
    if (!identity || seededRef.current || !isStoresPluginEnabled()) {
      return;
    }

    seededRef.current = true;
    const tenant = loadTenantConfig();

    void seedStoresFromTenant(dataProvider, tenant.storeSeed).catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("[stores] storeSeed の投入に失敗しました", error);
      }
    });
  }, [dataProvider, identity]);

  return null;
};

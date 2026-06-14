import { useDataProvider, useGetIdentity } from "ra-core";
import { useEffect, useRef } from "react";

import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";

import { isTrainingContentPluginEnabled } from "./isTrainingContentPluginEnabled";
import { seedTrainingContentFromTenant } from "./seedTrainingContent";

/** ログイン後にテナントの trainingContentSeed を一度だけ投入する */
export const TrainingContentSeedSync = () => {
  const dataProvider = useDataProvider();
  const { identity } = useGetIdentity();
  const seededRef = useRef(false);

  useEffect(() => {
    if (!identity || seededRef.current || !isTrainingContentPluginEnabled()) {
      return;
    }
    seededRef.current = true;
    const tenant = loadTenantConfig();
    void seedTrainingContentFromTenant(
      dataProvider,
      tenant.trainingContentSeed,
    ).catch((error) => {
      if (import.meta.env.DEV) {
        console.warn(
          "[training-content] trainingContentSeed の投入に失敗しました",
          error,
        );
      }
    });
  }, [dataProvider, identity]);

  return null;
};

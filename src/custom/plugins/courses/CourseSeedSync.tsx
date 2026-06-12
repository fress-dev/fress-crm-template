import { useDataProvider, useGetIdentity } from "ra-core";
import { useEffect, useRef } from "react";

import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";

import { isCoursesPluginEnabled } from "./isCoursesPluginEnabled";
import { seedCoursesFromTenant } from "./seedCourses";

/** ログイン後にテナントの courseSeed を一度だけ投入する */
export const CourseSeedSync = () => {
  const dataProvider = useDataProvider();
  const { identity } = useGetIdentity();
  const seededRef = useRef(false);

  useEffect(() => {
    if (!identity || seededRef.current || !isCoursesPluginEnabled()) return;
    seededRef.current = true;
    const tenant = loadTenantConfig();
    void seedCoursesFromTenant(dataProvider, tenant.courseSeed).catch(
      (error) => {
        if (import.meta.env.DEV) {
          console.warn("[courses] courseSeed の投入に失敗しました", error);
        }
      },
    );
  }, [dataProvider, identity]);

  return null;
};

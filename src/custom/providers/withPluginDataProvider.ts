import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import { isCoursesPluginEnabled } from "@/custom/plugins/courses/isCoursesPluginEnabled";
import { withCoursesDataProvider } from "@/custom/plugins/courses/withCoursesDataProvider";
import { isMembershipsPluginEnabled } from "@/custom/plugins/memberships/isMembershipsPluginEnabled";
import { withMembershipsDataProvider } from "@/custom/plugins/memberships/withMembershipsDataProvider";
import { isStoresPluginEnabled } from "@/custom/plugins/stores/isStoresPluginEnabled";
import { withStoresDataProvider } from "@/custom/plugins/stores/withStoresDataProvider";

/** 有効プラグイン向けの dataProvider 拡張を合成する（無効時は素通し） */
export const withPluginDataProvider = (
  dataProvider: CrmDataProvider,
): CrmDataProvider => {
  let wrapped = dataProvider;
  if (isStoresPluginEnabled()) {
    wrapped = withStoresDataProvider(wrapped);
  }
  if (isCoursesPluginEnabled()) {
    wrapped = withCoursesDataProvider(wrapped);
  }
  if (isMembershipsPluginEnabled()) {
    wrapped = withMembershipsDataProvider(wrapped);
  }
  return wrapped;
};

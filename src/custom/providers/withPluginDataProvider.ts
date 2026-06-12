import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import { isAppointmentsPluginEnabled } from "@/custom/plugins/appointments/isAppointmentsPluginEnabled";
import { withAppointmentsDataProvider } from "@/custom/plugins/appointments/withAppointmentsDataProvider";
import { isCoursesPluginEnabled } from "@/custom/plugins/courses/isCoursesPluginEnabled";
import { withCoursesDataProvider } from "@/custom/plugins/courses/withCoursesDataProvider";
import { isMembershipsPluginEnabled } from "@/custom/plugins/memberships/isMembershipsPluginEnabled";
import { withMembershipsDataProvider } from "@/custom/plugins/memberships/withMembershipsDataProvider";
import { isRoomsPluginEnabled } from "@/custom/plugins/rooms/isRoomsPluginEnabled";
import { withRoomsDataProvider } from "@/custom/plugins/rooms/withRoomsDataProvider";
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
  if (isRoomsPluginEnabled()) {
    wrapped = withRoomsDataProvider(wrapped);
  }
  if (isAppointmentsPluginEnabled()) {
    wrapped = withAppointmentsDataProvider(wrapped);
  }

  return wrapped;
};

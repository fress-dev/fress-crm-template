import type { DataProvider, Identifier } from "ra-core";

import type { CourseSeedEntry } from "@/custom/platform/tenant/types";

export type SeedCoursesResult = {
  seeded: number;
  skipped: boolean;
};

const resolveStoreIds = async (
  dataProvider: DataProvider,
  storeNames: string[] | undefined,
): Promise<Identifier[]> => {
  if (!storeNames?.length) return [];
  const { data: stores } = await dataProvider.getList("stores", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "name", order: "ASC" },
    filter: {},
  });
  const requested = new Set(storeNames.map((name) => name.trim()));
  return stores
    .filter((store) => requested.has(String(store.name ?? "").trim()))
    .map((store) => store.id);
};

/** courseSeed を courses テーブルへ投入（既存行があればスキップ） */
export const seedCoursesFromTenant = async (
  dataProvider: DataProvider,
  courseSeed: CourseSeedEntry[] | undefined,
): Promise<SeedCoursesResult> => {
  if (!courseSeed?.length) return { seeded: 0, skipped: true };
  const { total } = await dataProvider.getList("courses", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
    filter: {},
  });
  if (total && total > 0) return { seeded: 0, skipped: true };
  let seeded = 0;
  for (const entry of courseSeed) {
    const storeIds = await resolveStoreIds(dataProvider, entry.storeNames);
    await dataProvider.create("courses", {
      data: {
        name: entry.name,
        description: entry.description,
        course_type: entry.courseType,
        service_kind: entry.serviceKind,
        duration_minutes: entry.durationMinutes,
        display_order: entry.displayOrder ?? 100,
        is_active: entry.isActive ?? true,
        store_ids: storeIds,
      },
    });
    seeded += 1;
  }
  return { seeded, skipped: false };
};

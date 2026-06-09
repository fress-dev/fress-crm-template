import type { DataProvider } from "ra-core";

import type { StoreSeedEntry } from "@/custom/platform/tenant/types";

export type SeedStoresResult = {
  seeded: number;
  skipped: boolean;
};

/** storeSeed を stores テーブルへ投入（既存行があればスキップ） */
export const seedStoresFromTenant = async (
  dataProvider: DataProvider,
  storeSeed: StoreSeedEntry[] | undefined,
): Promise<SeedStoresResult> => {
  if (!storeSeed?.length) {
    return { seeded: 0, skipped: true };
  }

  const { total } = await dataProvider.getList("stores", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
    filter: {},
  });

  if (total && total > 0) {
    return { seeded: 0, skipped: true };
  }

  let seeded = 0;
  for (const entry of storeSeed) {
    await dataProvider.create("stores", { data: entry });
    seeded += 1;
  }

  return { seeded, skipped: false };
};

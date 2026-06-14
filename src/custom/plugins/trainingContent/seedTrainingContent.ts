import type { DataProvider } from "ra-core";

import type { TrainingTypeSeedEntry } from "@/custom/platform/tenant/types";

export type SeedTrainingContentResult = {
  seededTypes: number;
  seededGroups: number;
  skipped: boolean;
};

/** trainingContentSeed を training_types / training_groups へ投入（既存行があればスキップ） */
export const seedTrainingContentFromTenant = async (
  dataProvider: DataProvider,
  seed: TrainingTypeSeedEntry[] | undefined,
): Promise<SeedTrainingContentResult> => {
  if (!seed?.length) {
    return { seededTypes: 0, seededGroups: 0, skipped: true };
  }
  const { total } = await dataProvider.getList("training_types", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
    filter: {},
  });
  if (total && total > 0) {
    return { seededTypes: 0, seededGroups: 0, skipped: true };
  }

  let seededTypes = 0;
  let seededGroups = 0;
  for (const typeEntry of seed) {
    const { data: createdType } = await dataProvider.create("training_types", {
      data: {
        name: typeEntry.name,
        display_order: typeEntry.displayOrder ?? 100,
        is_active: typeEntry.isActive ?? true,
      },
    });
    seededTypes += 1;

    for (const groupEntry of typeEntry.groups ?? []) {
      await dataProvider.create("training_groups", {
        data: {
          training_type_id: createdType.id,
          name: groupEntry.name,
          description: groupEntry.description,
          display_order: groupEntry.displayOrder ?? 100,
          is_active: groupEntry.isActive ?? true,
        },
      });
      seededGroups += 1;
    }
  }
  return { seededTypes, seededGroups, skipped: false };
};

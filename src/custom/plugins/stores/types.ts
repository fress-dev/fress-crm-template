import type { RaRecord } from "ra-core";

export type Store = {
  name: string;
  area_code?: string;
  zip?: string;
  address?: string;
  build?: string;
  created_at?: string;
} & Pick<RaRecord, "id">;

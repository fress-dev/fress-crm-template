import type { RaRecord } from "ra-core";

export type Room = {
  store_id: number;
  name: string;
  del_flg?: boolean;
  created_at?: string;
  updated_at?: string;
} & Pick<RaRecord, "id">;

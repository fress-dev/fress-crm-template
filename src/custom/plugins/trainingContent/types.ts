import type { Identifier, RaRecord } from "ra-core";

// 種目カテゴリ（部位）
export type TrainingType = {
  name: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
} & Pick<RaRecord, "id">;

// 種目（カテゴリ配下）
export type TrainingGroup = {
  training_type_id: Identifier;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
} & Pick<RaRecord, "id">;

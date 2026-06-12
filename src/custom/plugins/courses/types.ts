import type { Identifier, RaRecord } from "ra-core";

export type CourseType = "single" | "membership" | "ticket";
export type CourseServiceKind = "training" | "stretch" | "training_and_stretch";

export type Course = {
  name: string;
  description?: string;
  course_type: CourseType;
  service_kind: CourseServiceKind;
  duration_minutes: number;
  is_active: boolean;
  display_order: number;
  store_ids?: Identifier[];
  created_at?: string;
  updated_at?: string;
} & Pick<RaRecord, "id">;

export type CourseStore = {
  course_id: Identifier;
  store_id: Identifier;
  created_at?: string;
} & Pick<RaRecord, "id">;

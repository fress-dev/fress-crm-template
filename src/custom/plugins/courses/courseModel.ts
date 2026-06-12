import type { Identifier } from "ra-core";

import type { Course } from "./types";

export const COURSE_NAME_MAX_LENGTH = 80;
export const COURSE_DESCRIPTION_MAX_LENGTH = 500;
export const COURSE_DURATION_MIN = 1;
export const COURSE_DURATION_MAX = 600;
export const COURSE_DISPLAY_ORDER_MIN = 0;
export const COURSE_DISPLAY_ORDER_MAX = 9999;

export const COURSE_TYPE_CHOICES = [
  { id: "ticket", name: "resources.courses.choices.course_type.ticket" },
  {
    id: "membership",
    name: "resources.courses.choices.course_type.membership",
  },
  { id: "single", name: "resources.courses.choices.course_type.single" },
];

export const COURSE_SERVICE_KIND_CHOICES = [
  { id: "training", name: "resources.courses.choices.service_kind.training" },
  { id: "stretch", name: "resources.courses.choices.service_kind.stretch" },
  {
    id: "training_and_stretch",
    name: "resources.courses.choices.service_kind.training_and_stretch",
  },
];

export const normalizeCourseName = (name: string | undefined): string =>
  (name ?? "").trim();

export const cleanupCourseForSave = (
  values: Partial<Course>,
): Partial<Course> => ({
  ...values,
  name: normalizeCourseName(values.name),
  description: values.description?.trim() || undefined,
  course_type: values.course_type ?? "ticket",
  service_kind: values.service_kind ?? "training",
  duration_minutes:
    values.duration_minutes === undefined || values.duration_minutes === null
      ? 60
      : Number(values.duration_minutes),
  display_order:
    values.display_order === undefined || values.display_order === null
      ? 100
      : Number(values.display_order),
  is_active: values.is_active ?? true,
  store_ids: values.store_ids ?? [],
});

export const validateCourseNameRequired = (value: string | undefined) => {
  if (!normalizeCourseName(value)) {
    return "resources.courses.validation.name_required";
  }
  return undefined;
};

export const validateCourseNameMaxLength = (value: string | undefined) => {
  if (normalizeCourseName(value).length > COURSE_NAME_MAX_LENGTH) {
    return "resources.courses.validation.name_max_length";
  }
  return undefined;
};

export const validateCourseDescriptionMaxLength = (
  value: string | undefined,
) => {
  const description = value?.trim();
  if (!description) return undefined;
  if (description.length > COURSE_DESCRIPTION_MAX_LENGTH) {
    return "resources.courses.validation.description_max_length";
  }
  return undefined;
};

export const validateCourseDuration = (value: number | undefined) => {
  if (value === undefined || value === null || value === ("" as unknown)) {
    return undefined;
  }
  const duration = Number(value);
  if (!Number.isInteger(duration)) {
    return "resources.courses.validation.duration_required";
  }
  if (duration < COURSE_DURATION_MIN || duration > COURSE_DURATION_MAX) {
    return "resources.courses.validation.duration_range";
  }
  return undefined;
};

export const validateCourseDisplayOrder = (value: number | undefined) => {
  if (value === undefined || value === null || value === ("" as unknown)) {
    return undefined;
  }
  const displayOrder = Number(value);
  if (!Number.isInteger(displayOrder)) {
    return "resources.courses.validation.display_order_required";
  }
  if (
    displayOrder < COURSE_DISPLAY_ORDER_MIN ||
    displayOrder > COURSE_DISPLAY_ORDER_MAX
  ) {
    return "resources.courses.validation.display_order_range";
  }
  return undefined;
};

export type CourseNameUniqueCheck = (
  name: string,
  currentId?: Identifier,
) => Promise<boolean>;

/** 同名コースが既にあればバリデーションエラーキーを返す */
export const validateCourseNameUnique =
  (
    isDuplicate: CourseNameUniqueCheck,
    currentId?: Identifier,
    currentName?: string,
  ) =>
  async (value: string | undefined) => {
    const name = normalizeCourseName(value);
    if (!name) return undefined;
    if (
      currentName &&
      normalizeCourseName(currentName).toLowerCase() === name.toLowerCase()
    ) {
      return undefined;
    }
    const duplicate = await isDuplicate(name, currentId);
    if (duplicate) return "resources.courses.validation.duplicate_name";
    return undefined;
  };

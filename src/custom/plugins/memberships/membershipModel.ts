import type { MembershipStatus } from "./types";

export const MEMBERSHIP_STATUS_CHOICES: {
  id: MembershipStatus;
  name: string;
}[] = [
  { id: "active", name: "resources.memberships.choices.status.active" },
  { id: "completed", name: "resources.memberships.choices.status.completed" },
  { id: "cancelled", name: "resources.memberships.choices.status.cancelled" },
];

export const MEMBERSHIP_TICKET_STATUS_CHOICES = [
  {
    id: "available",
    name: "resources.memberships.choices.ticket_status.available",
  },
  {
    id: "reserved",
    name: "resources.memberships.choices.ticket_status.reserved",
  },
  { id: "used", name: "resources.memberships.choices.ticket_status.used" },
  {
    id: "cancelled",
    name: "resources.memberships.choices.ticket_status.cancelled",
  },
] as const;

export const validateMembershipTicketCount = (value: number | undefined) => {
  if (value == null || Number.isNaN(value)) {
    return "resources.memberships.validation.ticket_count_required";
  }
  if (!Number.isInteger(value) || value < 1 || value > 999) {
    return "resources.memberships.validation.ticket_count_range";
  }
  return undefined;
};

export const validateMembershipContactRequired = (value: unknown) => {
  if (value == null || value === "") {
    return "resources.memberships.validation.contact_required";
  }
  return undefined;
};

export const validateMembershipCourseRequired = (value: unknown) => {
  if (value == null || value === "") {
    return "resources.memberships.validation.course_required";
  }
  return undefined;
};

export const cleanupMembershipForSave = <T extends Record<string, unknown>>(
  data: T,
): T => {
  const next = { ...data } as Record<string, unknown>;
  if (next.notes === "") next.notes = null;
  if (next.started_at === "") next.started_at = null;
  if (next.ended_at === "") next.ended_at = null;
  if (next.store_id === "") next.store_id = null;
  return next as T;
};

export const LOCKED_TICKET_STATUSES = new Set(["reserved", "used"]);

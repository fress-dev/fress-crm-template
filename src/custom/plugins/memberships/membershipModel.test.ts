import { describe, expect, it } from "vitest";

import {
  validateMembershipContactRequired,
  validateMembershipCourseRequired,
  validateMembershipTicketCount,
} from "./membershipModel";

describe("membershipModel", () => {
  it("validates ticket count", () => {
    expect(validateMembershipTicketCount(undefined)).toBe(
      "resources.memberships.validation.ticket_count_required",
    );
    expect(validateMembershipTicketCount(0)).toBe(
      "resources.memberships.validation.ticket_count_range",
    );
    expect(validateMembershipTicketCount(4)).toBeUndefined();
  });

  it("validates required references", () => {
    expect(validateMembershipContactRequired(null)).toBe(
      "resources.memberships.validation.contact_required",
    );
    expect(validateMembershipCourseRequired(null)).toBe(
      "resources.memberships.validation.course_required",
    );
  });
});

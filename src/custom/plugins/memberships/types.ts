export type MembershipStatus = "active" | "completed" | "cancelled";

export type MembershipTicketStatus =
  | "available"
  | "reserved"
  | "used"
  | "cancelled";

export type Membership = {
  id: number;
  contact_id: number;
  course_id: number;
  store_id?: number | null;
  ticket_count: number;
  status: MembershipStatus;
  started_at?: string | null;
  ended_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  available_ticket_count?: number;
  used_ticket_count?: number;
};

export type MembershipTicket = {
  id: number;
  membership_id: number;
  contact_id: number;
  ticket_number: number;
  status: MembershipTicketStatus;
  used_at?: string | null;
  created_at: string;
};

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import type {
  CreateParams,
  DataProvider,
  DeleteParams,
  Identifier,
  RaRecord,
  UpdateParams,
} from "ra-core";

import { LOCKED_TICKET_STATUSES } from "./membershipModel";
import type { Membership, MembershipTicket } from "./types";

const MEMBERSHIPS_RESOURCE = "memberships";
const MEMBERSHIP_TICKETS_RESOURCE = "membership_tickets";

const countTicketsByStatus = (
  tickets: MembershipTicket[],
  status: MembershipTicket["status"],
) => tickets.filter((ticket) => ticket.status === status).length;

const getMembershipTickets = async (
  dataProvider: DataProvider,
  membershipId: Identifier,
): Promise<MembershipTicket[]> => {
  const { data } = await dataProvider.getList<MembershipTicket>(
    MEMBERSHIP_TICKETS_RESOURCE,
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "ticket_number", order: "ASC" },
      filter: { membership_id: membershipId },
    },
  );
  return data;
};

const withTicketCounts = async <RecordType extends RaRecord = Membership>(
  dataProvider: DataProvider,
  record: RecordType,
): Promise<RecordType & Membership> => {
  const tickets = await getMembershipTickets(dataProvider, record.id);
  return {
    ...record,
    available_ticket_count: countTicketsByStatus(tickets, "available"),
    used_ticket_count: countTicketsByStatus(tickets, "used"),
  } as RecordType & Membership;
};

const createMembershipTickets = async (
  dataProvider: DataProvider,
  membership: Membership,
): Promise<void> => {
  for (
    let ticketNumber = 1;
    ticketNumber <= membership.ticket_count;
    ticketNumber++
  ) {
    await dataProvider.create(MEMBERSHIP_TICKETS_RESOURCE, {
      data: {
        membership_id: membership.id,
        contact_id: membership.contact_id,
        ticket_number: ticketNumber,
        status: "available",
      },
    });
  }
};

const deleteMembershipTickets = async (
  dataProvider: DataProvider,
  membershipId: Identifier,
): Promise<void> => {
  const tickets = await getMembershipTickets(dataProvider, membershipId);
  for (const ticket of tickets) {
    await dataProvider.delete(MEMBERSHIP_TICKETS_RESOURCE, {
      id: ticket.id,
      previousData: ticket,
    });
  }
};

/** memberships リソースのチケット発行・削除ガードを扱う */
export const withMembershipsDataProvider = (
  dataProvider: CrmDataProvider,
): CrmDataProvider => {
  const getOne = dataProvider.getOne.bind(dataProvider);
  const create = dataProvider.create.bind(dataProvider);
  const update = dataProvider.update.bind(dataProvider);
  const deleteOne = dataProvider.delete.bind(dataProvider);

  return {
    ...dataProvider,
    getOne: async (resource, params, ...rest) => {
      const result = await getOne(resource, params, ...rest);
      if (resource !== MEMBERSHIPS_RESOURCE) return result;
      return {
        ...result,
        data: await withTicketCounts(dataProvider, result.data),
      };
    },
    create: async (resource, params: CreateParams, ...rest) => {
      if (resource !== MEMBERSHIPS_RESOURCE) {
        return create(resource, params, ...rest);
      }
      const { ticket_count: ticketCount, ...membershipData } = params.data;
      const result = await create(
        resource,
        {
          ...params,
          data: {
            ...membershipData,
            ticket_count: ticketCount,
            status: membershipData.status ?? "active",
          },
        },
        ...rest,
      );
      await createMembershipTickets(dataProvider, result.data as Membership);
      return {
        ...result,
        data: await withTicketCounts(dataProvider, result.data),
      };
    },
    update: async (resource, params: UpdateParams, ...rest) => {
      if (resource !== MEMBERSHIPS_RESOURCE) {
        return update(resource, params, ...rest);
      }
      const { ticket_count: _ignored, ...membershipData } = params.data;
      const result = await update(
        resource,
        { ...params, data: membershipData },
        ...rest,
      );
      return {
        ...result,
        data: await withTicketCounts(dataProvider, result.data),
      };
    },
    delete: async (resource, params: DeleteParams, ...rest) => {
      if (resource !== MEMBERSHIPS_RESOURCE) {
        return deleteOne(resource, params, ...rest);
      }
      const tickets = await getMembershipTickets(dataProvider, params.id);
      const hasLockedTicket = tickets.some((ticket) =>
        LOCKED_TICKET_STATUSES.has(ticket.status),
      );
      if (hasLockedTicket) {
        throw new Error("resources.memberships.error.delete_locked_tickets");
      }
      await deleteMembershipTickets(dataProvider, params.id);
      return deleteOne(resource, params, ...rest);
    },
  };
};

export { getMembershipTickets, MEMBERSHIP_TICKETS_RESOURCE };

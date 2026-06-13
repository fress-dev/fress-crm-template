import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import type {
  CreateParams,
  DataProvider,
  DeleteParams,
  GetListParams,
  Identifier,
  UpdateParams,
} from "ra-core";

import { MEMBERSHIP_TICKETS_RESOURCE } from "@/custom/plugins/memberships/withMembershipsDataProvider";
import type { MembershipTicket } from "@/custom/plugins/memberships/types";

import type { SessionLog } from "./types";

const SESSION_LOGS_RESOURCE = "session_logs";

export const applySessionLogsActiveFilter = <
  T extends { filter?: Record<string, unknown> },
>(
  params: T,
): T => {
  const filter = params.filter ?? {};

  if (Object.prototype.hasOwnProperty.call(filter, "del_flg")) {
    return { ...params, filter };
  }

  return { ...params, filter: { ...filter, del_flg: false } };
};

const resolveContactIdsForSearch = async (
  dataProvider: DataProvider,
  query: string,
): Promise<Identifier[]> => {
  const { data } = await dataProvider.getList("contacts", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "id", order: "ASC" },
    filter: {
      "@or": {
        "first_name@ilike": query,
        "last_name@ilike": query,
      },
    },
  });

  return data.map((record) => record.id);
};

export const applySessionLogsSearch = async (
  dataProvider: DataProvider,
  params: GetListParams,
): Promise<GetListParams> => {
  if (!params.filter?.q) {
    return params;
  }

  const { q, ...filter } = params.filter;
  const query = String(q).trim();
  if (!query) {
    return { ...params, filter };
  }

  const contactIds = await resolveContactIdsForSearch(dataProvider, query);
  const orFilter: Record<string, unknown> = {
    "comment@ilike": query,
  };

  if (contactIds.length > 0) {
    orFilter["contact_id@in"] = contactIds;
  }

  return {
    ...params,
    filter: {
      ...filter,
      "@or": orFilter,
    },
  };
};

const getMembershipTicket = async (
  dataProvider: DataProvider,
  ticketId: Identifier,
): Promise<MembershipTicket> => {
  const { data } = await dataProvider.getOne<MembershipTicket>(
    MEMBERSHIP_TICKETS_RESOURCE,
    { id: Number(ticketId) },
  );
  return data;
};

const assertTicketConsumable = (
  ticket: MembershipTicket,
  contactId: number | string,
): void => {
  if (Number(ticket.contact_id) !== Number(contactId)) {
    throw new Error("resources.session_logs.error.ticket_contact_mismatch");
  }
  if (ticket.status !== "available") {
    throw new Error("resources.session_logs.error.ticket_not_available");
  }
};

const consumeTicket = async (
  dataProvider: DataProvider,
  ticketId: Identifier,
  performedAt: string,
): Promise<void> => {
  const ticket = await getMembershipTicket(dataProvider, ticketId);
  await dataProvider.update(MEMBERSHIP_TICKETS_RESOURCE, {
    id: ticketId,
    data: {
      status: "used",
      used_at: performedAt,
    },
    previousData: ticket,
  });
};

const releaseTicket = async (
  dataProvider: DataProvider,
  ticketId: Identifier,
): Promise<void> => {
  const ticket = await getMembershipTicket(dataProvider, ticketId);
  if (ticket.status !== "used") {
    return;
  }

  await dataProvider.update(MEMBERSHIP_TICKETS_RESOURCE, {
    id: ticketId,
    data: {
      status: "available",
      used_at: null,
    },
    previousData: ticket,
  });
};

const syncTicketConsumption = async (
  dataProvider: DataProvider,
  sessionLog: SessionLog,
  previousTicketId?: Identifier | null,
): Promise<void> => {
  const nextTicketId = sessionLog.membership_ticket_id ?? null;
  const prevTicketId = previousTicketId ?? null;

  if (nextTicketId && Number(nextTicketId) !== Number(prevTicketId)) {
    const ticket = await getMembershipTicket(dataProvider, nextTicketId);
    assertTicketConsumable(ticket, sessionLog.contact_id);
    await consumeTicket(dataProvider, nextTicketId, sessionLog.performed_at);
  }

  if (
    prevTicketId &&
    (!nextTicketId || Number(prevTicketId) !== Number(nextTicketId))
  ) {
    await releaseTicket(dataProvider, prevTicketId);
  }
};

/** session_logs リソースの検索・論理削除・チケット消費を扱う */
export const withSessionLogsDataProvider = (
  dataProvider: CrmDataProvider,
): CrmDataProvider => {
  const getList = dataProvider.getList.bind(dataProvider);
  const create = dataProvider.create.bind(dataProvider);
  const update = dataProvider.update.bind(dataProvider);
  const deleteFn = dataProvider.delete.bind(dataProvider);

  return {
    ...dataProvider,
    getList: async (resource, params, ...rest) => {
      if (resource !== SESSION_LOGS_RESOURCE) {
        return getList(resource, params, ...rest);
      }

      const withFilter = applySessionLogsActiveFilter(params);
      const withSearch = await applySessionLogsSearch(dataProvider, withFilter);

      return getList(resource, withSearch, ...rest);
    },
    create: async (resource, params: CreateParams, ...rest) => {
      if (resource !== SESSION_LOGS_RESOURCE) {
        return create(resource, params, ...rest);
      }

      const sessionData = params.data as Partial<SessionLog>;
      if (sessionData.membership_ticket_id) {
        const ticket = await getMembershipTicket(
          dataProvider,
          sessionData.membership_ticket_id,
        );
        assertTicketConsumable(ticket, sessionData.contact_id as Identifier);
      }

      const result = await create(resource, params, ...rest);
      const sessionLog = result.data as SessionLog;

      if (sessionLog.membership_ticket_id) {
        await consumeTicket(
          dataProvider,
          sessionLog.membership_ticket_id,
          sessionLog.performed_at,
        );
      }

      return result;
    },
    update: async (resource, params: UpdateParams, ...rest) => {
      if (resource !== SESSION_LOGS_RESOURCE) {
        return update(resource, params, ...rest);
      }

      const previousData = params.previousData as SessionLog | undefined;
      const sessionData = params.data as Partial<SessionLog>;
      const contactId = sessionData.contact_id ?? previousData?.contact_id;

      if (sessionData.membership_ticket_id && contactId) {
        const ticket = await getMembershipTicket(
          dataProvider,
          sessionData.membership_ticket_id,
        );
        const isSameTicket =
          previousData?.membership_ticket_id != null &&
          Number(previousData.membership_ticket_id) ===
            Number(sessionData.membership_ticket_id);

        if (!isSameTicket) {
          assertTicketConsumable(ticket, contactId);
        }
      }

      const result = await update(resource, params, ...rest);
      const sessionLog = result.data as SessionLog;

      await syncTicketConsumption(
        dataProvider,
        sessionLog,
        previousData?.membership_ticket_id,
      );

      return result;
    },
    delete: (resource, params: DeleteParams, ...rest) => {
      if (resource !== SESSION_LOGS_RESOURCE) {
        return deleteFn(resource, params, ...rest);
      }

      const { id, previousData } = params;
      return update(
        resource,
        {
          id,
          data: { del_flg: true },
          previousData,
        },
        ...rest,
      );
    },
  };
};

export { SESSION_LOGS_RESOURCE };

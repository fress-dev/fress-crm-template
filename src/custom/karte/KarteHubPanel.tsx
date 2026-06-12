import type { ReactNode } from "react";
import type { Identifier } from "ra-core";
import { useGetList, useShowContext, useTranslate } from "ra-core";
import { Link } from "react-router";

import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Contact } from "@/components/atomic-crm/types";
import type { Deal } from "@/components/atomic-crm/types";

/** stores プラグインが contacts に追加する store_id（コア型には未反映） */
type ContactWithStore = Contact & { store_id?: Identifier | null };
import { isPluginEnabled } from "@/custom/platform/plugin/isPluginEnabled";
import { isResourceHidden } from "@/custom/platform/tenant/isResourceHidden";
import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";

type KarteHubSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

const KarteHubSection = ({ title, action, children }: KarteHubSectionProps) => (
  <section>
    <div className="mb-2 flex items-center justify-between gap-2">
      <h4 className="text-sm font-semibold">{title}</h4>
      {action}
    </div>
    <Separator className="mb-3" />
    {children}
  </section>
);

const KarteHubPlaceholder = ({ messageKey }: { messageKey: string }) => {
  const translate = useTranslate();
  return (
    <p className="text-sm text-muted-foreground">{translate(messageKey)}</p>
  );
};

const KarteStoreSection = () => {
  const translate = useTranslate();
  const { record } = useShowContext<ContactWithStore>();

  if (!isPluginEnabled("stores") || !record) {
    return null;
  }

  return (
    <KarteHubSection title={translate("custom.karte.store.title")}>
      {record.store_id != null ? (
        <ReferenceField
          record={record}
          source="store_id"
          reference="stores"
          link="show"
        >
          <TextField source="name" className="text-sm" />
        </ReferenceField>
      ) : (
        <KarteHubPlaceholder messageKey="custom.karte.store.empty" />
      )}
    </KarteHubSection>
  );
};

const KarteDealsSectionInner = ({ contactId }: { contactId: Identifier }) => {
  const translate = useTranslate();

  const { data, isPending } = useGetList<Deal>("deals", {
    filter: { "contact_ids@cs": `{${contactId}}` },
    sort: { field: "created_at", order: "DESC" },
    pagination: { page: 1, perPage: 5 },
  });

  return (
    <KarteHubSection
      title={translate("custom.karte.deals.title")}
      action={
        <Button variant="outline" size="sm" asChild>
          <Link to="/deals/create">{translate("custom.karte.deals.add")}</Link>
        </Button>
      }
    >
      {isPending ? (
        <Skeleton className="h-8 w-full" />
      ) : !data?.length ? (
        <KarteHubPlaceholder messageKey="custom.karte.deals.empty" />
      ) : (
        <ul className="space-y-2 text-sm">
          {data.map((deal) => (
            <li key={deal.id}>
              <Link
                to={`/deals/${deal.id}/show`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {deal.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </KarteHubSection>
  );
};

const KarteDealsSection = ({ contactId }: { contactId: Identifier }) => {
  const tenant = loadTenantConfig();

  if (isResourceHidden(tenant, "deals")) {
    return null;
  }

  return <KarteDealsSectionInner contactId={contactId} />;
};

const KarteMembershipsSection = () => {
  const translate = useTranslate();

  if (isPluginEnabled("memberships")) {
    return null;
  }

  return (
    <KarteHubSection title={translate("custom.karte.memberships.title")}>
      <KarteHubPlaceholder messageKey="custom.karte.memberships.placeholder" />
    </KarteHubSection>
  );
};

const KarteAppointmentsSection = () => {
  const translate = useTranslate();

  if (isPluginEnabled("appointments")) {
    return null;
  }

  return (
    <KarteHubSection title={translate("custom.karte.appointments.title")}>
      <KarteHubPlaceholder messageKey="custom.karte.appointments.placeholder" />
    </KarteHubSection>
  );
};

const KarteSessionLogSection = () => {
  const translate = useTranslate();

  if (isPluginEnabled("session-log")) {
    return null;
  }

  return (
    <KarteHubSection title={translate("custom.karte.sessionLog.title")}>
      <KarteHubPlaceholder messageKey="custom.karte.sessionLog.placeholder" />
    </KarteHubSection>
  );
};

/** 会員 Show に表示するカルテハブ（各プラグインへの入口） */
export const KarteHubPanel = () => {
  const translate = useTranslate();
  const { record, isPending } = useShowContext<ContactWithStore>();

  if (isPending || !record) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {translate("custom.karte.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <KarteStoreSection />
        <KarteDealsSection contactId={record.id} />
        <KarteMembershipsSection />
        <KarteAppointmentsSection />
        <KarteSessionLogSection />
      </CardContent>
    </Card>
  );
};

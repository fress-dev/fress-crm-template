import { ContactListFilter as CoreContactListFilter } from "@/components/atomic-crm/contacts/ContactListFilter.core";
import { ContactListFilterSummary as CoreContactListFilterSummary } from "@/components/atomic-crm/contacts/ContactListFilter.core";

import { isStoresPluginEnabled } from "./isStoresPluginEnabled";
import {
  ContactListFilterWithStore,
  ContactListFilterSummaryWithStore,
} from "./ContactListFilterWithStore";

export const ContactListFilter = () => {
  if (!isStoresPluginEnabled()) {
    return <CoreContactListFilter />;
  }
  return <ContactListFilterWithStore />;
};

export const ContactListFilterSummary = () => {
  if (!isStoresPluginEnabled()) {
    return <CoreContactListFilterSummary />;
  }
  return <ContactListFilterSummaryWithStore />;
};

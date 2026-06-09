import { ContactInputs as CoreContactInputs } from "@/components/atomic-crm/contacts/ContactInputs.core";

import { isStoresPluginEnabled } from "./isStoresPluginEnabled";
import { ContactInputsWithStore } from "./ContactInputsWithStore";

export { ContactStatusSelector } from "@/components/atomic-crm/contacts/ContactInputs.core";

export const ContactInputs = () => {
  if (!isStoresPluginEnabled()) {
    return <CoreContactInputs />;
  }
  return <ContactInputsWithStore />;
};

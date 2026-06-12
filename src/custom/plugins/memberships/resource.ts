import type { PluginResourceProps } from "@/custom/platform/plugin/types";

import { MembershipCreate } from "./MembershipCreate";
import { MembershipEdit } from "./MembershipEdit";
import { MembershipList } from "./MembershipList";
import { MembershipShow } from "./MembershipShow";
import type { Membership } from "./types";

const membershipsResource: PluginResourceProps = {
  list: MembershipList,
  create: MembershipCreate,
  edit: MembershipEdit,
  show: MembershipShow,
  recordRepresentation: (record) => {
    const membership = record as Membership;
    return `#${membership.id}`;
  },
};

export default membershipsResource;

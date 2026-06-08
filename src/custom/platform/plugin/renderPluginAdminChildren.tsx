import { Resource } from "ra-core";

import { loadTenantConfig } from "../tenant/loadTenantConfig";
import { getEnabledPlugins } from "./registry";

/** 有効プラグインの Resource を Admin 子要素として返す */
export const renderPluginAdminChildren = () => {
  const tenant = loadTenantConfig();
  const plugins = getEnabledPlugins(tenant.plugins, { warnUnknown: false });

  return plugins.flatMap((plugin) =>
    (plugin.resources ?? []).map((resource) => (
      <Resource key={resource.name} name={resource.name} {...resource.props} />
    )),
  );
};

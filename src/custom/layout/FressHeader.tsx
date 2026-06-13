import { FileText, Import, Settings, User, Users } from "lucide-react";
import { CanAccess, useTranslate, useUserMenu } from "ra-core";
import { Link, matchPath, useLocation } from "react-router";
import { RefreshButton } from "@/components/admin/refresh-button";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { UserMenu } from "@/components/admin/user-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { useConfigurationContext } from "@/components/atomic-crm/root/ConfigurationContext";
import { ImportPage } from "@/components/atomic-crm/misc/ImportPage";
import { ChangelogPage } from "@/components/atomic-crm/misc/ChangelogPage";
import { isAppointmentsPluginEnabled } from "@/custom/plugins/appointments/isAppointmentsPluginEnabled";
import { isCoursesPluginEnabled } from "@/custom/plugins/courses/isCoursesPluginEnabled";
import { isMembershipsPluginEnabled } from "@/custom/plugins/memberships/isMembershipsPluginEnabled";
import { isRoomsPluginEnabled } from "@/custom/plugins/rooms/isRoomsPluginEnabled";
import { isSessionLogPluginEnabled } from "@/custom/plugins/sessionLog/isSessionLogPluginEnabled";
import { isStoresPluginEnabled } from "@/custom/plugins/stores/isStoresPluginEnabled";
import { isResourceHidden } from "@/custom/platform/tenant/isResourceHidden";
import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";

export const FressHeader = () => {
  const { darkModeLogo, lightModeLogo, title } = useConfigurationContext();
  const location = useLocation();
  const translate = useTranslate();
  const tenant = loadTenantConfig();

  let currentPath: string | boolean = "/";
  if (matchPath("/", location.pathname)) {
    currentPath = "/";
  } else if (matchPath("/contacts/*", location.pathname)) {
    currentPath = "/contacts";
  } else if (matchPath("/companies/*", location.pathname)) {
    currentPath = "/companies";
  } else if (matchPath("/deals/*", location.pathname)) {
    currentPath = "/deals";
  } else if (matchPath("/stores/*", location.pathname)) {
    currentPath = "/stores";
  } else if (matchPath("/courses/*", location.pathname)) {
    currentPath = "/courses";
  } else if (matchPath("/memberships/*", location.pathname)) {
    currentPath = "/memberships";
  } else if (matchPath("/rooms/*", location.pathname)) {
    currentPath = "/rooms";
  } else if (matchPath("/appointments/*", location.pathname)) {
    currentPath = "/appointments";
  } else if (matchPath("/session_logs/*", location.pathname)) {
    currentPath = "/session_logs";
  } else {
    currentPath = false;
  }

  const storesEnabled = isStoresPluginEnabled();
  const coursesEnabled = isCoursesPluginEnabled();
  const membershipsEnabled = isMembershipsPluginEnabled();
  const roomsEnabled = isRoomsPluginEnabled();
  const appointmentsEnabled = isAppointmentsPluginEnabled();
  const sessionLogEnabled = isSessionLogPluginEnabled();

  return (
    <>
      <nav className="grow">
        <header className="bg-secondary">
          <div className="px-4">
            <div className="flex justify-between items-center flex-1">
              <Link
                to="/"
                className="flex items-center gap-2 text-secondary-foreground no-underline"
              >
                <img
                  className="[.light_&]:hidden h-6"
                  src={darkModeLogo}
                  alt={title}
                />
                <img
                  className="[.dark_&]:hidden h-6"
                  src={lightModeLogo}
                  alt={title}
                />
                <h1 className="text-xl font-semibold">{title}</h1>
              </Link>
              <div>
                <nav className="flex">
                  <NavigationTab
                    label={translate("ra.page.dashboard")}
                    to="/"
                    isActive={currentPath === "/"}
                  />
                  {!isResourceHidden(tenant, "contacts") ? (
                    <NavigationTab
                      label={translate("resources.contacts.name", {
                        smart_count: 2,
                      })}
                      to="/contacts"
                      isActive={currentPath === "/contacts"}
                    />
                  ) : null}
                  {!isResourceHidden(tenant, "companies") ? (
                    <NavigationTab
                      label={translate("resources.companies.name", {
                        smart_count: 2,
                      })}
                      to="/companies"
                      isActive={currentPath === "/companies"}
                    />
                  ) : null}
                  {!isResourceHidden(tenant, "deals") ? (
                    <NavigationTab
                      label={translate("resources.deals.name", {
                        smart_count: 2,
                      })}
                      to="/deals"
                      isActive={currentPath === "/deals"}
                    />
                  ) : null}
                  {storesEnabled ? (
                    <NavigationTab
                      label={translate("resources.stores.name", {
                        smart_count: 2,
                      })}
                      to="/stores"
                      isActive={currentPath === "/stores"}
                    />
                  ) : null}
                  {coursesEnabled ? (
                    <NavigationTab
                      label={translate("resources.courses.name", {
                        smart_count: 2,
                      })}
                      to="/courses"
                      isActive={currentPath === "/courses"}
                    />
                  ) : null}
                  {membershipsEnabled ? (
                    <NavigationTab
                      label={translate("resources.memberships.name", {
                        smart_count: 2,
                      })}
                      to="/memberships"
                      isActive={currentPath === "/memberships"}
                    />
                  ) : null}
                  {roomsEnabled ? (
                    <NavigationTab
                      label={translate("resources.rooms.name", {
                        smart_count: 2,
                      })}
                      to="/rooms"
                      isActive={currentPath === "/rooms"}
                    />
                  ) : null}
                  {appointmentsEnabled ? (
                    <NavigationTab
                      label={translate("resources.appointments.name", {
                        smart_count: 2,
                      })}
                      to="/appointments"
                      isActive={currentPath === "/appointments"}
                    />
                  ) : null}
                  {sessionLogEnabled ? (
                    <NavigationTab
                      label={translate("resources.session_logs.name", {
                        smart_count: 2,
                      })}
                      to="/session_logs"
                      isActive={currentPath === "/session_logs"}
                    />
                  ) : null}
                </nav>
              </div>
              <div className="flex items-center">
                <ThemeModeToggle />
                <RefreshButton />
                <UserMenu>
                  <ProfileMenu />
                  {!isResourceHidden(tenant, "sales") ? (
                    <CanAccess resource="sales" action="list">
                      <UsersMenu />
                    </CanAccess>
                  ) : null}
                  <CanAccess resource="configuration" action="edit">
                    <SettingsMenu />
                  </CanAccess>
                  <ImportFromJsonMenuItem />
                  <ChangelogMenuItem />
                </UserMenu>
              </div>
            </div>
          </div>
        </header>
      </nav>
    </>
  );
};

const NavigationTab = ({
  label,
  to,
  isActive,
}: {
  label: string;
  to: string;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
      isActive
        ? "text-secondary-foreground border-secondary-foreground"
        : "text-secondary-foreground/70 border-transparent hover:text-secondary-foreground/80"
    }`}
  >
    {label}
  </Link>
);

const UsersMenu = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<UsersMenu> must be used inside <UserMenu?");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to="/sales" className="flex items-center gap-2">
        <Users />
        {translate("resources.sales.name", { smart_count: 2 })}
      </Link>
    </DropdownMenuItem>
  );
};

const ProfileMenu = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<ProfileMenu> must be used inside <UserMenu?");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to="/profile" className="flex items-center gap-2">
        <User />
        {translate("crm.profile.title")}
      </Link>
    </DropdownMenuItem>
  );
};

const SettingsMenu = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<SettingsMenu> must be used inside <UserMenu>");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to="/settings" className="flex items-center gap-2">
        <Settings />
        {translate("crm.settings.title")}
      </Link>
    </DropdownMenuItem>
  );
};

const ImportFromJsonMenuItem = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<ImportFromJsonMenuItem> must be used inside <UserMenu>");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to={ImportPage.path} className="flex items-center gap-2">
        <Import />
        {translate("crm.header.import_data")}
      </Link>
    </DropdownMenuItem>
  );
};

const ChangelogMenuItem = () => {
  const translate = useTranslate();
  const userMenuContext = useUserMenu();
  if (!userMenuContext) {
    throw new Error("<ChangelogMenuItem> must be used inside <UserMenu>");
  }
  return (
    <DropdownMenuItem asChild onClick={userMenuContext.onClose}>
      <Link to={ChangelogPage.path} className="flex items-center gap-2">
        <FileText />
        {translate("crm.changelog.title")}
      </Link>
    </DropdownMenuItem>
  );
};

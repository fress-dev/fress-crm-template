import { CreateButton } from "@/components/admin/create-button";
import { useTranslate } from "ra-core";

export const MembershipEmpty = () => {
  const translate = useTranslate();

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <h2 className="text-lg font-semibold">
        {translate("resources.memberships.empty.title")}
      </h2>
      <p className="text-sm text-muted-foreground">
        {translate("resources.memberships.empty.description")}
      </p>
      <CreateButton label="resources.memberships.action.new" />
    </div>
  );
};

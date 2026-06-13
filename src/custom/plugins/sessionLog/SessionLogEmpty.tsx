import { CreateButton } from "@/components/admin/create-button";
import { useTranslate } from "ra-core";

export const SessionLogEmpty = () => {
  const translate = useTranslate();

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <h2 className="text-lg font-semibold">
        {translate("resources.session_logs.empty.title")}
      </h2>
      <p className="text-muted-foreground">
        {translate("resources.session_logs.empty.description")}
      </p>
      <CreateButton label="resources.session_logs.action.new" />
    </div>
  );
};

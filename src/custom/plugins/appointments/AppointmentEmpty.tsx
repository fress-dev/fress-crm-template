import { useTranslate } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";

export const AppointmentEmpty = () => {
  const translate = useTranslate();

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h2 className="text-xl font-semibold">
        {translate("resources.appointments.empty.title")}
      </h2>
      <p className="text-muted-foreground max-w-md">
        {translate("resources.appointments.empty.description")}
      </p>
      <CreateButton label="resources.appointments.action.new" />
    </div>
  );
};

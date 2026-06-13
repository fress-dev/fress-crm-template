import {
  CreateBase,
  Form,
  useGetIdentity,
  useGetOne,
  useTranslate,
} from "ra-core";
import { useSearchParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";

import type { Appointment } from "@/custom/plugins/appointments/types";

import { SessionLogInputs } from "./SessionLogInputs";
import { SessionLogPageShell } from "./SessionLogPageShell";

const toDatetimeLocalValue = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const SessionLogCreate = () => {
  const translate = useTranslate();
  const { identity } = useGetIdentity();
  const [searchParams] = useSearchParams();
  const appointmentIdParam = searchParams.get("appointment_id");
  const appointmentId = appointmentIdParam
    ? Number(appointmentIdParam)
    : undefined;

  const { data: appointment, isLoading } = useGetOne<Appointment>(
    "appointments",
    { id: appointmentId ?? 0 },
    { enabled: appointmentId != null && !Number.isNaN(appointmentId) },
  );

  const defaultValues = {
    sales_id: identity?.id,
    performed_at: toDatetimeLocalValue(new Date()),
    ...(appointment
      ? {
          appointment_id: appointment.id,
          contact_id: appointment.contact_id ?? undefined,
          sales_id: appointment.sales_id ?? identity?.id,
          store_id: appointment.store_id ?? undefined,
          performed_at: toDatetimeLocalValue(new Date(appointment.start_at)),
        }
      : {}),
  };

  if (appointmentId != null && !Number.isNaN(appointmentId) && isLoading) {
    return null;
  }

  return (
    <CreateBase redirect="show" record={defaultValues}>
      <SessionLogPageShell>
        <Form defaultValues={defaultValues}>
          <Card>
            <CardContent>
              <SessionLogInputs />
              <div
                role="toolbar"
                className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
              >
                <CancelButton />
                <SaveButton
                  label={translate("resources.session_logs.action.create", {
                    _: "Create Session Log",
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </Form>
      </SessionLogPageShell>
    </CreateBase>
  );
};

import { CreateBase, Form, useTranslate } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";

import { cleanupMembershipForSave, MembershipInputs } from "./MembershipInputs";
import { MembershipPageShell } from "./MembershipPageShell";

export const MembershipCreate = () => {
  const translate = useTranslate();
  const defaultValues = {
    ticket_count: 4,
    status: "active",
  } as const;

  return (
    <CreateBase
      redirect="show"
      transform={cleanupMembershipForSave}
      record={defaultValues}
    >
      <MembershipPageShell>
        <Form defaultValues={defaultValues}>
          <Card>
            <CardContent>
              <MembershipInputs />
              <div
                role="toolbar"
                className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
              >
                <CancelButton />
                <SaveButton
                  type="button"
                  label={translate("resources.memberships.action.create", {
                    _: "Create Membership",
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </Form>
      </MembershipPageShell>
    </CreateBase>
  );
};

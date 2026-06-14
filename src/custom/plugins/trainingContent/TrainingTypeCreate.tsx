import { CreateBase, Form, useTranslate } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import {
  cleanupTrainingTypeForSave,
  TrainingTypeInputs,
} from "./TrainingTypeInputs";
import { TrainingFormToolbar } from "./TrainingFormToolbar";
import { TrainingPageShell } from "./TrainingPageShell";

export const TrainingTypeCreate = () => {
  const translate = useTranslate();
  const defaultValues = {
    display_order: 100,
    is_active: true,
  } as const;

  return (
    <CreateBase
      redirect="list"
      transform={cleanupTrainingTypeForSave}
      record={defaultValues}
    >
      <TrainingPageShell>
        <Form defaultValues={defaultValues}>
          <Card>
            <CardContent>
              <TrainingTypeInputs />
              <TrainingFormToolbar
                label={translate("resources.training_types.action.create", {
                  _: "Create",
                })}
              />
            </CardContent>
          </Card>
        </Form>
      </TrainingPageShell>
    </CreateBase>
  );
};

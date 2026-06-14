import { CreateBase, Form, useTranslate } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import {
  cleanupTrainingGroupForSave,
  TrainingGroupInputs,
} from "./TrainingGroupInputs";
import { TrainingFormToolbar } from "./TrainingFormToolbar";
import { TrainingPageShell } from "./TrainingPageShell";

export const TrainingGroupCreate = () => {
  const translate = useTranslate();
  const defaultValues = {
    display_order: 100,
    is_active: true,
  } as const;

  return (
    <CreateBase
      redirect="show"
      transform={cleanupTrainingGroupForSave}
      record={defaultValues}
    >
      <TrainingPageShell>
        <Form defaultValues={defaultValues}>
          <Card>
            <CardContent>
              <TrainingGroupInputs />
              <TrainingFormToolbar
                label={translate("resources.training_groups.action.create", {
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

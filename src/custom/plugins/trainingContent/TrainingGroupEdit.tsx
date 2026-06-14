import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import {
  cleanupTrainingGroupForSave,
  TrainingGroupInputs,
} from "./TrainingGroupInputs";
import { TrainingFormToolbar } from "./TrainingFormToolbar";
import { TrainingGroupDeleteButton } from "./TrainingGroupDeleteButton";
import { TrainingPageShell } from "./TrainingPageShell";

export const TrainingGroupEdit = () => (
  <EditBase
    actions={false}
    redirect="show"
    transform={cleanupTrainingGroupForSave}
  >
    <TrainingPageShell>
      <Form className="flex flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <TrainingGroupInputs />
            <div className="flex justify-start pt-2">
              <TrainingGroupDeleteButton />
            </div>
            <TrainingFormToolbar />
          </CardContent>
        </Card>
      </Form>
    </TrainingPageShell>
  </EditBase>
);

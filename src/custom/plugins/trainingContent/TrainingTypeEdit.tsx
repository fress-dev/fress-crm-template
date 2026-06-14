import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import {
  cleanupTrainingTypeForSave,
  TrainingTypeInputs,
} from "./TrainingTypeInputs";
import { TrainingFormToolbar } from "./TrainingFormToolbar";
import { TrainingPageShell } from "./TrainingPageShell";
import { TrainingTypeDeleteButton } from "./TrainingTypeDeleteButton";

export const TrainingTypeEdit = () => (
  <EditBase
    actions={false}
    redirect="list"
    transform={cleanupTrainingTypeForSave}
  >
    <TrainingPageShell>
      <Form className="flex flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <TrainingTypeInputs />
            <div className="flex justify-start pt-2">
              <TrainingTypeDeleteButton />
            </div>
            <TrainingFormToolbar />
          </CardContent>
        </Card>
      </Form>
    </TrainingPageShell>
  </EditBase>
);

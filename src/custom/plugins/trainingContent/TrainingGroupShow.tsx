import { EditButton } from "@/components/admin/edit-button";
import { NumberField } from "@/components/admin/number-field";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShowBase, useTranslate } from "ra-core";

import { TrainingActiveField } from "./TrainingActiveField";
import { TrainingCreatedAtField } from "./TrainingCreatedAtField";
import { TrainingGroupDeleteButton } from "./TrainingGroupDeleteButton";
import { TrainingPageShell } from "./TrainingPageShell";

const EMPTY = "—";

export const TrainingGroupShow = () => {
  const translate = useTranslate();
  return (
    <ShowBase>
      <TrainingPageShell>
        <div className="flex justify-end gap-2 mb-4">
          <EditButton />
          <TrainingGroupDeleteButton />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TextField source="name" />
              <TrainingActiveField resource="training_groups" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <RecordField source="training_type_id">
              <ReferenceField
                source="training_type_id"
                reference="training_types"
                link={false}
                empty={translate("resources.training_groups.show.no_type")}
              >
                <TextField source="name" />
              </ReferenceField>
            </RecordField>
            <RecordField source="description">
              <TextField source="description" empty={EMPTY} />
            </RecordField>
            <RecordField source="display_order">
              <NumberField source="display_order" />
            </RecordField>
            <RecordField source="created_at">
              <TrainingCreatedAtField />
            </RecordField>
          </CardContent>
        </Card>
      </TrainingPageShell>
    </ShowBase>
  );
};

import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { cleanupCourseForSave, CourseInputs } from "./CourseInputs";
import { CourseDeleteButton } from "./CourseDeleteButton";
import { CourseFormToolbar } from "./CourseFormToolbar";
import { CoursePageShell } from "./CoursePageShell";

export const CourseEdit = () => (
  <EditBase actions={false} redirect="show" transform={cleanupCourseForSave}>
    <CoursePageShell>
      <Form className="flex flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <CourseInputs />
            <div className="flex justify-start pt-2">
              <CourseDeleteButton />
            </div>
            <CourseFormToolbar />
          </CardContent>
        </Card>
      </Form>
    </CoursePageShell>
  </EditBase>
);

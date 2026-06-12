import { CreateBase, Form, useTranslate } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { cleanupCourseForSave, CourseInputs } from "./CourseInputs";
import { CourseFormToolbar } from "./CourseFormToolbar";
import { CoursePageShell } from "./CoursePageShell";

export const CourseCreate = () => {
  const translate = useTranslate();
  const defaultValues = {
    course_type: "ticket",
    service_kind: "training",
    duration_minutes: 60,
    display_order: 100,
    is_active: true,
  } as const;

  return (
    <CreateBase
      redirect="show"
      transform={cleanupCourseForSave}
      record={defaultValues}
    >
      <CoursePageShell>
        <Form defaultValues={defaultValues}>
          <Card>
            <CardContent>
              <CourseInputs />
              <CourseFormToolbar
                label={translate("resources.courses.action.create", {
                  _: "Create Course",
                })}
              />
            </CardContent>
          </Card>
        </Form>
      </CoursePageShell>
    </CreateBase>
  );
};

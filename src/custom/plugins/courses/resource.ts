import type { PluginResourceProps } from "@/custom/platform/plugin/types";

import { CourseCreate } from "./CourseCreate";
import { CourseEdit } from "./CourseEdit";
import { CourseList } from "./CourseList";
import { CourseShow } from "./CourseShow";
import type { Course } from "./types";

const coursesResource: PluginResourceProps = {
  list: CourseList,
  create: CourseCreate,
  edit: CourseEdit,
  show: CourseShow,
  recordRepresentation: (record) => (record as Course).name,
};

export default coursesResource;

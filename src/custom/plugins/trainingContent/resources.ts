import type { PluginResourceProps } from "@/custom/platform/plugin/types";

import { TrainingGroupCreate } from "./TrainingGroupCreate";
import { TrainingGroupEdit } from "./TrainingGroupEdit";
import { TrainingGroupList } from "./TrainingGroupList";
import { TrainingGroupShow } from "./TrainingGroupShow";
import { TrainingTypeCreate } from "./TrainingTypeCreate";
import { TrainingTypeEdit } from "./TrainingTypeEdit";
import { TrainingTypeList } from "./TrainingTypeList";
import type { TrainingGroup, TrainingType } from "./types";

export const trainingTypesResource: PluginResourceProps = {
  list: TrainingTypeList,
  create: TrainingTypeCreate,
  edit: TrainingTypeEdit,
  recordRepresentation: (record) => (record as TrainingType).name,
};

export const trainingGroupsResource: PluginResourceProps = {
  list: TrainingGroupList,
  create: TrainingGroupCreate,
  edit: TrainingGroupEdit,
  show: TrainingGroupShow,
  recordRepresentation: (record) => (record as TrainingGroup).name,
};

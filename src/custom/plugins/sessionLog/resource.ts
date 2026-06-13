import type { PluginResourceProps } from "@/custom/platform/plugin/types";

import { SessionLogCreate } from "./SessionLogCreate";
import { SessionLogEdit } from "./SessionLogEdit";
import { SessionLogList } from "./SessionLogList";
import { SessionLogShow } from "./SessionLogShow";
import type { SessionLog } from "./types";

const formatRecordLabel = (record: SessionLog): string => {
  const performedAt = new Date(record.performed_at).toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `セッション ${performedAt}`;
};

const sessionLogsResource: PluginResourceProps = {
  list: SessionLogList,
  create: SessionLogCreate,
  edit: SessionLogEdit,
  show: SessionLogShow,
  recordRepresentation: (record) => formatRecordLabel(record as SessionLog),
};

export default sessionLogsResource;

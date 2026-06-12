export type FeatureStatus = "not-started" | "in-progress" | "done" | "on-hold";

export type Feature = {
  id: string;
  salus: string;
  crm: string;
  layer: string;
  status: FeatureStatus;
  priority: string | null;
  depends_on: string[];
  scenarios: string[];
  design?: string | null;
  pr?: string;
  branch?: string;
  notes?: string;
  assignee?: string;
};

export type BacklogData = {
  version: number;
  last_updated: string;
  primary_tenant: string;
  scenarios: Record<string, string>;
  decisions: Array<{
    id: string;
    question: string;
    status: string;
    value: unknown;
  }>;
  features: Feature[];
};

export const COLUMN_ORDER: FeatureStatus[] = [
  "not-started",
  "in-progress",
  "done",
  "on-hold",
];

export const COLUMN_LABELS: Record<FeatureStatus, string> = {
  "not-started": "未着手",
  "in-progress": "着手",
  done: "完了",
  "on-hold": "保留",
};

/** 旧 status 値（移行用） */
export const LEGACY_STATUS_MAP: Record<string, FeatureStatus> = {
  next: "not-started",
  blocked: "on-hold",
  skip: "on-hold",
};

export const ASSIGNEE_OPTIONS = [
  "未割当",
  "メインエージェント",
  "@reviewer",
  "@db-migrator",
  "人間",
] as const;

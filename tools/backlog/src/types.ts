export type FeatureStatus =
  | "next"
  | "in-progress"
  | "blocked"
  | "done"
  | "skip";

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
  "next",
  "in-progress",
  "blocked",
  "done",
  "skip",
];

export const COLUMN_LABELS: Record<FeatureStatus, string> = {
  next: "着手候補",
  "in-progress": "進行中",
  blocked: "ブロック",
  done: "完了",
  skip: "スキップ",
};

export const ASSIGNEE_OPTIONS = [
  "未割当",
  "メインエージェント",
  "@reviewer",
  "@db-migrator",
  "人間",
] as const;

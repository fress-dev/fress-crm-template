import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isMap, isSeq, parseDocument } from "yaml";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const FEATURES_PATH = path.join(ROOT, "docs/product/features.yaml");

export type FeatureStatus = "not-started" | "in-progress" | "done" | "on-hold";

const LEGACY_STATUS_MAP: Record<string, FeatureStatus> = {
  next: "not-started",
  blocked: "on-hold",
  skip: "on-hold",
};

const normalizeStatus = (status: unknown): FeatureStatus | undefined => {
  if (typeof status !== "string") return undefined;
  if (
    status === "not-started" ||
    status === "in-progress" ||
    status === "done" ||
    status === "on-hold"
  ) {
    return status;
  }
  return LEGACY_STATUS_MAP[status];
};

export type FeatureUpdate = {
  status?: FeatureStatus;
  assignee?: string | null;
};

const readDoc = () => {
  const content = fs.readFileSync(FEATURES_PATH, "utf8");
  return { content, doc: parseDocument(content) };
};

export const loadBacklog = () => {
  const { doc } = readDoc();
  const data = doc.toJSON() as {
    features?: Array<{ status?: string }>;
  };

  for (const feature of data.features ?? []) {
    const normalized = normalizeStatus(feature.status);
    if (normalized) {
      feature.status = normalized;
    }
  }

  return data;
};

const findFeatureMap = (id: string) => {
  const { doc } = readDoc();
  const features = doc.get("features", true);
  if (!isSeq(features)) {
    throw new Error("features.yaml: features が見つかりません");
  }

  for (const item of features.items) {
    if (!isMap(item)) continue;
    const idNode = item.get("id", true);
    if (idNode?.value === id) {
      return { doc, item };
    }
  }

  return null;
};

export const updateFeature = (id: string, update: FeatureUpdate) => {
  const found = findFeatureMap(id);
  if (!found) {
    throw new Error(`features.yaml: id="${id}" が見つかりません`);
  }

  const { doc, item } = found;

  if (update.status !== undefined) {
    item.set("status", update.status);
  }

  if (update.assignee !== undefined) {
    if (update.assignee === null || update.assignee === "") {
      item.delete("assignee");
    } else {
      item.set("assignee", update.assignee);
    }
  }

  doc.set("last_updated", new Date().toISOString().slice(0, 10));
  fs.writeFileSync(FEATURES_PATH, String(doc), "utf8");

  return doc.toJSON();
};

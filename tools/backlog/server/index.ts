import cors from "cors";
import express from "express";

import { loadBacklog, updateFeature, type FeatureStatus } from "./yamlStore.js";

const app = express();
const PORT = 3456;

const STATUSES: FeatureStatus[] = [
  "not-started",
  "in-progress",
  "done",
  "on-hold",
];

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/backlog", (_req, res) => {
  try {
    res.json(loadBacklog());
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "読み込みに失敗しました",
    });
  }
});

app.patch("/api/features/:id", (req, res) => {
  const { id } = req.params;
  const { status, assignee } = req.body ?? {};

  if (status !== undefined && !STATUSES.includes(status)) {
    res.status(400).json({ error: `不正な status: ${status}` });
    return;
  }

  try {
    const data = updateFeature(id, { status, assignee });
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "更新に失敗しました",
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.warn(`[backlog] API http://127.0.0.1:${PORT}`);
});

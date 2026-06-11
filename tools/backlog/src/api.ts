import type { BacklogData, FeatureStatus } from "./types";

export const fetchBacklog = async (): Promise<BacklogData> => {
  const res = await fetch("/api/backlog");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
};

export const patchFeature = async (
  id: string,
  update: { status?: FeatureStatus; assignee?: string | null },
): Promise<BacklogData> => {
  const res = await fetch(`/api/features/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
};

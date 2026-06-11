import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchBacklog, patchFeature } from "./api";
import { KanbanColumn } from "./components/KanbanColumn";
import { FeatureCard } from "./components/FeatureCard";
import {
  COLUMN_ORDER,
  type BacklogData,
  type Feature,
  type FeatureStatus,
} from "./types";

const isFeatureStatus = (value: string): value is FeatureStatus =>
  COLUMN_ORDER.includes(value as FeatureStatus);

export const App = () => {
  const [data, setData] = useState<BacklogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [hideDone, setHideDone] = useState(true);
  const [hideOnHold, setHideOnHold] = useState(false);
  const [layerFilter, setLayerFilter] = useState("all");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchBacklog());
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const doneIds = useMemo(
    () =>
      new Set(
        (data?.features ?? [])
          .filter((f) => f.status === "done")
          .map((f) => f.id),
      ),
    [data],
  );

  const layers = useMemo(() => {
    const set = new Set((data?.features ?? []).map((f) => f.layer));
    return ["all", ...Array.from(set).sort()];
  }, [data]);

  const filteredFeatures = useMemo(() => {
    if (!data) return [];
    return data.features.filter((f) => {
      if (hideDone && f.status === "done") return false;
      if (hideOnHold && f.status === "on-hold") return false;
      if (layerFilter !== "all" && f.layer !== layerFilter) return false;
      return true;
    });
  }, [data, hideDone, hideOnHold, layerFilter]);

  const columns = useMemo(() => {
    const map = Object.fromEntries(
      COLUMN_ORDER.map((status) => [status, [] as Feature[]]),
    ) as Record<FeatureStatus, Feature[]>;

    for (const feature of filteredFeatures) {
      map[feature.status]?.push(feature);
    }

    return map;
  }, [filteredFeatures]);

  const visibleColumns = COLUMN_ORDER.filter((status) => {
    if (hideDone && status === "done") return false;
    if (hideOnHold && status === "on-hold") return false;
    return true;
  });

  const persistStatus = async (id: string, status: FeatureStatus) => {
    setError(null);
    try {
      const next = await patchFeature(id, { status });
      setData(next);
      setInfo(`${id} → ${status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
      await reload();
    }
  };

  const handleAssigneeChange = async (id: string, assignee: string | null) => {
    setError(null);
    try {
      const next = await patchFeature(id, { assignee });
      setData(next);
      setInfo(assignee ? `${id} の担当: ${assignee}` : `${id} の担当を解除`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
      await reload();
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const feature = event.active.data.current?.feature as Feature | undefined;
    setActiveFeature(feature ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveFeature(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const nextStatus = String(over.id);
    if (!isFeatureStatus(nextStatus)) return;

    const feature = active.data.current?.feature as Feature | undefined;
    if (!feature || feature.status === nextStatus) return;

    void persistStatus(feature.id, nextStatus);
  };

  if (loading && !data) {
    return <div className="loading">読み込み中…</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Fress Backlog</h1>
          <div className="app-header-meta">
            {data
              ? `更新: ${data.last_updated} / テナント: ${data.primary_tenant} / docs/product/features.yaml`
              : "ローカル専用"}
          </div>
        </div>
        <div className="toolbar">
          <label>
            <input
              type="checkbox"
              checked={hideDone}
              onChange={(e) => setHideDone(e.target.checked)}
            />
            完了を隠す
          </label>
          <label>
            <input
              type="checkbox"
              checked={hideOnHold}
              onChange={(e) => setHideOnHold(e.target.checked)}
            />
            保留を隠す
          </label>
          <label>
            層
            <select
              value={layerFilter}
              onChange={(e) => setLayerFilter(e.target.value)}
            >
              {layers.map((layer) => (
                <option key={layer} value={layer}>
                  {layer === "all" ? "すべて" : layer}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => void reload()}>
            再読み込み
          </button>
        </div>
      </header>

      {error ? <div className="banner banner-error">{error}</div> : null}
      {info ? <div className="banner banner-info">{info}</div> : null}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          {visibleColumns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              features={columns[status]}
              doneIds={doneIds}
              onAssigneeChange={(id, assignee) =>
                void handleAssigneeChange(id, assignee)
              }
              onRequest={setInfo}
            />
          ))}
        </div>
        <DragOverlay>
          {activeFeature ? (
            <FeatureCard
              feature={activeFeature}
              doneIds={doneIds}
              onAssigneeChange={() => {}}
              onRequest={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

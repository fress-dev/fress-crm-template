import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { buildRequestPrompt } from "../buildRequestPrompt";
import { ASSIGNEE_OPTIONS, type Feature } from "../types";

type Props = {
  feature: Feature;
  doneIds: Set<string>;
  onAssigneeChange: (id: string, assignee: string | null) => void;
  onRequest: (message: string) => void;
};

const priorityClass = (priority: string | null) => {
  if (priority === "P0") return "badge badge-p0";
  if (priority === "P1") return "badge badge-p1";
  return "badge";
};

const unresolvedDeps = (feature: Feature, doneIds: Set<string>) =>
  feature.depends_on.filter((dep) => !doneIds.has(dep));

export const FeatureCard = ({
  feature,
  doneIds,
  onAssigneeChange,
  onRequest,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: feature.id,
      data: { feature },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const deps = unresolvedDeps(feature, doneIds);
  const assignee = feature.assignee ?? "未割当";

  const copyRequest = async () => {
    const prompt = buildRequestPrompt(feature);
    await navigator.clipboard.writeText(prompt);
    onRequest(`依頼文をコピーしました: ${feature.id}`);
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`card${isDragging ? " card-dragging" : ""}`}
      {...listeners}
      {...attributes}
    >
      <div className="card-id">{feature.id}</div>
      <div className="card-salus">{feature.salus}</div>
      <div className="card-crm">{feature.crm}</div>
      <div className="card-badges">
        {feature.priority ? (
          <span className={priorityClass(feature.priority)}>
            {feature.priority}
          </span>
        ) : null}
        <span className="badge badge-layer">{feature.layer}</span>
        {feature.scenarios.map((s) => (
          <span key={s} className="badge">
            {s}
          </span>
        ))}
      </div>
      {deps.length > 0 ? (
        <div className="card-deps-warn">依存未完了: {deps.join(", ")}</div>
      ) : null}
      <div className="card-actions">
        <select
          value={assignee}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const value = e.target.value;
            onAssigneeChange(feature.id, value === "未割当" ? null : value);
          }}
        >
          {ASSIGNEE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="primary"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => void copyRequest()}
        >
          依頼をコピー
        </button>
      </div>
    </article>
  );
};

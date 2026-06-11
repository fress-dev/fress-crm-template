import { useDroppable } from "@dnd-kit/core";

import type { Feature, FeatureStatus } from "../types";
import { COLUMN_LABELS } from "../types";
import { FeatureCard } from "./FeatureCard";

type Props = {
  status: FeatureStatus;
  features: Feature[];
  doneIds: Set<string>;
  onAssigneeChange: (id: string, assignee: string | null) => void;
  onRequest: (message: string) => void;
};

export const KanbanColumn = ({
  status,
  features,
  doneIds,
  onAssigneeChange,
  onRequest,
}: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section className="column">
      <header className="column-header">
        <span>{COLUMN_LABELS[status]}</span>
        <span className="column-count">{features.length}</span>
      </header>
      <div
        ref={setNodeRef}
        className={`column-body${isOver ? " column-body-over" : ""}`}
      >
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            doneIds={doneIds}
            onAssigneeChange={onAssigneeChange}
            onRequest={onRequest}
          />
        ))}
      </div>
    </section>
  );
};

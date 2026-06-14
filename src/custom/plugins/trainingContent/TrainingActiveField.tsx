import { Badge } from "@/components/ui/badge";
import { useFieldValue, useTranslate } from "ra-core";

/** 新規選択肢として利用可能かを表示する（resource ごとに status 文言を切り替え） */
export const TrainingActiveField = ({
  resource = "training_groups",
}: {
  resource?: "training_groups" | "training_types";
}) => {
  const isActive = useFieldValue({ source: "is_active" });
  const translate = useTranslate();
  return (
    <Badge variant={isActive ? "default" : "outline"}>
      {translate(
        isActive
          ? `resources.${resource}.status.active`
          : `resources.${resource}.status.inactive`,
      )}
    </Badge>
  );
};

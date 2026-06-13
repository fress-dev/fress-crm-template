import { Badge } from "@/components/ui/badge";
import { useFieldValue, useTranslate } from "ra-core";

/** 新規選択肢として利用可能かを表示する */
export const CourseActiveField = () => {
  const isActive = useFieldValue({ source: "is_active" });
  const translate = useTranslate();
  return (
    <Badge variant={isActive ? "default" : "outline"}>
      {translate(
        isActive
          ? "resources.courses.status.active"
          : "resources.courses.status.inactive",
      )}
    </Badge>
  );
};

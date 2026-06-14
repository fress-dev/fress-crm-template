import { useFieldValue, useLocaleState } from "ra-core";

import { formatLocalizedDateTime } from "@/custom/misc/RelativeDate";

/** 登録日時を日本時間で時分秒まで表示する */
export const TrainingCreatedAtField = () => {
  const value = useFieldValue({ source: "created_at" });
  const [locale = "ja"] = useLocaleState();
  if (!value || typeof value !== "string") return null;
  return <span>{formatLocalizedDateTime(value, locale)}</span>;
};

import { loadTenantConfig } from "@/custom/platform/tenant/loadTenantConfig";
import type { AppointmentTypeConfig } from "@/custom/platform/tenant/types";

/** テナント未設定時の予約種別デフォルト */
export const DEFAULT_APPOINTMENT_TYPES: AppointmentTypeConfig[] = [
  { id: "session", label: "セッション" },
  { id: "counseling", label: "カウンセリング" },
  { id: "trial", label: "体験" },
  { id: "other", label: "その他" },
];

/** テナント設定から予約種別一覧を取得する */
export const getAppointmentTypes = (): AppointmentTypeConfig[] => {
  const tenant = loadTenantConfig();
  return tenant.appointmentTypes ?? DEFAULT_APPOINTMENT_TYPES;
};

/** 種別コードから表示ラベルを解決する */
export const getAppointmentTypeLabel = (typeId: string): string => {
  const match = getAppointmentTypes().find((item) => item.id === typeId);
  return match?.label ?? typeId;
};

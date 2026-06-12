import type { ReactNode } from "react";

/** Aside なしの予約 Show / Edit / Create で共通の幅・中央寄せ */
export const APPOINTMENT_PAGE_CLASS = "mt-2 mx-auto w-full max-w-2xl";

export const AppointmentPageShell = ({ children }: { children: ReactNode }) => (
  <div className={APPOINTMENT_PAGE_CLASS}>{children}</div>
);

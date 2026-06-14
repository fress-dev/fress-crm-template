import type { ReactNode } from "react";

/** Aside なしの種目マスタ Show / Edit / Create で共通の幅・中央寄せ */
export const TRAINING_PAGE_CLASS = "mt-2 mx-auto w-full max-w-2xl";

export const TrainingPageShell = ({ children }: { children: ReactNode }) => (
  <div className={TRAINING_PAGE_CLASS}>{children}</div>
);

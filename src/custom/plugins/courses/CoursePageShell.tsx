import type { ReactNode } from "react";

/** Aside なしのコース Show / Edit / Create で共通の幅・中央寄せ */
export const COURSE_PAGE_CLASS = "mt-2 mx-auto w-full max-w-2xl";

export const CoursePageShell = ({ children }: { children: ReactNode }) => (
  <div className={COURSE_PAGE_CLASS}>{children}</div>
);

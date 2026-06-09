import type { ReactNode } from "react";

/** Aside なしの店舗 Show / Edit / Create で共通の幅・中央寄せ */
export const STORE_PAGE_CLASS = "mt-2 mx-auto w-full max-w-2xl";

export const StorePageShell = ({ children }: { children: ReactNode }) => (
  <div className={STORE_PAGE_CLASS}>{children}</div>
);

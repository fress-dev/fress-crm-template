import type { ReactNode } from "react";

/** Aside なしの部屋 Show / Edit / Create で共通の幅・中央寄せ */
export const ROOM_PAGE_CLASS = "mt-2 mx-auto w-full max-w-2xl";

export const RoomPageShell = ({ children }: { children: ReactNode }) => (
  <div className={ROOM_PAGE_CLASS}>{children}</div>
);

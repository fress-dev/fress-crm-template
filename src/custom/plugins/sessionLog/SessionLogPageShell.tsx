import type { ReactNode } from "react";

type SessionLogPageShellProps = {
  children: ReactNode;
};

/** Aside なしの狭いマスタ画面用シェル */
export const SessionLogPageShell = ({ children }: SessionLogPageShellProps) => (
  <div className="mx-auto w-full max-w-2xl">{children}</div>
);

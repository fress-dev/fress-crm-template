import type { ReactNode } from "react";

type MembershipPageShellProps = {
  children: ReactNode;
};

/** Aside なしの狭いマスタ画面用シェル */
export const MembershipPageShell = ({ children }: MembershipPageShellProps) => (
  <div className="mx-auto w-full max-w-2xl">{children}</div>
);

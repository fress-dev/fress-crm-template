import type { ReactNode } from "react";

import { MobileLayout } from "@/components/atomic-crm/layout/MobileLayout";
import { useIsMobile } from "@/hooks/use-mobile";

import { PlainJapaneseConfigurationSync } from "@/custom/configuration/PlainJapaneseConfigurationSync";
import { FressLayout } from "@/custom/layout/FressLayout";
import { CourseSeedSync } from "@/custom/plugins/courses/CourseSeedSync";
import { StoreSeedSync } from "@/custom/plugins/stores/StoreSeedSync";

const PlainJapaneseLayoutShell = ({
  children,
  mobile,
}: {
  children: ReactNode;
  mobile: boolean;
}) => (
  <>
    <PlainJapaneseConfigurationSync />
    <StoreSeedSync />
    <CourseSeedSync />
    {mobile ? (
      <MobileLayout>{children}</MobileLayout>
    ) : (
      <FressLayout>{children}</FressLayout>
    )}
  </>
);

export const PlainJapaneseLayout = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <PlainJapaneseLayoutShell mobile={isMobile}>
      {children}
    </PlainJapaneseLayoutShell>
  );
};

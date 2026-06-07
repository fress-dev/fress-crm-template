import type { ReactNode } from "react";

import { Layout } from "@/components/atomic-crm/layout/Layout";
import { MobileLayout } from "@/components/atomic-crm/layout/MobileLayout";
import { useIsMobile } from "@/hooks/use-mobile";

import { PlainJapaneseConfigurationSync } from "@/custom/configuration/PlainJapaneseConfigurationSync";

const PlainJapaneseLayoutShell = ({
  children,
  mobile,
}: {
  children: ReactNode;
  mobile: boolean;
}) => (
  <>
    <PlainJapaneseConfigurationSync />
    {mobile ? (
      <MobileLayout>{children}</MobileLayout>
    ) : (
      <Layout>{children}</Layout>
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

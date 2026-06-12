import type { TenantConfig } from "./types";

const plural = (label: string): string => `${label} |||| ${label}`;

/** テナント別ラベルを i18n 上書き用メッセージへ変換する */
export const toI18nOverrides = (tenant: TenantConfig) => {
  const labels = tenant.labels;
  if (!labels) {
    return {};
  }

  return {
    resources: {
      contacts: {
        name: plural(labels.contacts),
        forcedCaseName: labels.contacts,
      },
      deals: {
        name: plural(labels.deals),
        forcedCaseName: labels.deals,
      },
      sales: {
        name: plural(labels.sales),
        forcedCaseName: labels.sales,
      },
      ...(labels.companies
        ? {
            companies: {
              name: plural(labels.companies),
              forcedCaseName: labels.companies,
            },
          }
        : {}),
    },
  };
};

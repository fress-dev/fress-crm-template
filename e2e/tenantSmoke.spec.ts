import { test, expect } from "./fixtures";
import { ja } from "./ja";
import fs from "node:fs";
import path from "node:path";

type TenantSmokeConfig = {
  title: string;
  hiddenResources?: string[];
  labels?: {
    contacts?: string;
    deals?: string;
    companies?: string;
  };
};

const tenantId = process.env.TENANT_ID ?? process.env.VITE_TENANT_ID;

const loadTenantConfig = (): TenantSmokeConfig => {
  if (!tenantId) {
    throw new Error("TENANT_ID または VITE_TENANT_ID を指定してください");
  }

  const filePath = path.resolve("tenants", `${tenantId}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as TenantSmokeConfig;
};

test.describe("tenant smoke", () => {
  test.skip(
    !tenantId,
    "TENANT_ID または VITE_TENANT_ID を指定したときだけ実行する",
  );

  const tenant = tenantId ? loadTenantConfig() : undefined;

  test("tenant labels and hidden resources are applied", async ({
    page,
    isMobile,
    createSales,
  }) => {
    test.skip(isMobile, "ヘッダーのリソース表示確認は desktop だけで行う");

    await createSales({
      first_name: "Tenant",
      last_name: "Admin",
      email: "tenant-smoke@example.com",
      password: "password",
    });

    await page.goto("http://localhost:5175/");
    await page.getByLabel(ja.email).fill("tenant-smoke@example.com");
    await page.getByLabel(ja.password).fill("password");
    await page.getByRole("button", { name: ja.signIn }).click();
    await page.waitForLoadState("networkidle");

    if (!tenant) {
      throw new Error("テナント設定を読み込めませんでした");
    }

    await expect(page).toHaveTitle(new RegExp(tenant.title));

    if (tenant.labels?.contacts) {
      await expect(
        page.getByRole("link", { name: tenant.labels.contacts }),
      ).toBeVisible();
    }

    if (tenant.labels?.deals) {
      await expect(
        page.getByRole("link", { name: tenant.labels.deals }),
      ).toBeVisible();
    }

    if (tenant.labels?.companies) {
      await expect(
        page.getByRole("link", { name: tenant.labels.companies }),
      ).toHaveCount(tenant.hiddenResources?.includes("companies") ? 0 : 1);
    }
  });
});

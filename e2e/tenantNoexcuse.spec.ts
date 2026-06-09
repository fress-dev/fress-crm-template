import { test, expect } from "./fixtures";
import { ja } from "./ja";

test.describe("noexcuse tenant", () => {
  test.skip(
    process.env.VITE_TENANT_ID !== "noexcuse",
    "VITE_TENANT_ID=noexcuse で起動したときだけ実行する",
  );

  test("tenant labels and hidden resources are applied", async ({
    page,
    isMobile,
    createSales,
  }) => {
    test.skip(isMobile, "ヘッダーのリソース表示確認は desktop だけで行う");

    await createSales({
      first_name: "Tenant",
      last_name: "Admin",
      email: "tenant-noexcuse@example.com",
      password: "password",
    });

    await page.goto("http://localhost:5175/");
    await page.getByLabel(ja.email).fill("tenant-noexcuse@example.com");
    await page.getByLabel(ja.password).fill("password");
    await page.getByRole("button", { name: ja.signIn }).click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveTitle(new RegExp(ja.noexcuseAppTitle));
    await expect(
      page.getByRole("link", { name: ja.noexcuseContacts }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: ja.noexcuseDeals }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: ja.noexcuseCompanies }),
    ).toHaveCount(0);
  });
});

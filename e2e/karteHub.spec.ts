import { test, expect } from "./fixtures";
import { ja } from "./ja";
import fs from "node:fs";
import path from "node:path";

const tenantConfig = JSON.parse(
  fs.readFileSync(path.resolve("tenants/default.json"), "utf8"),
) as { plugins: string[] };

test("contact show displays karte hub sections", async ({
  page,
  isMobile,
  createSales,
  createContact,
}) => {
  const sales = await createSales({
    first_name: "Karte",
    last_name: "Admin",
    email: "karte-hub@example.com",
    password: "password",
  });

  await page.goto("http://localhost:5175/");
  await page.getByLabel(ja.email).fill("karte-hub@example.com");
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.signIn }).click();
  await page.waitForLoadState("networkidle");

  const contact = await createContact({
    first_name: "太郎",
    last_name: "会員",
    sales_id: sales.id,
  });

  await page.goto(`http://localhost:5175/#/contacts/${contact.id}/show`);
  await page.waitForLoadState("networkidle");

  if (isMobile) {
    await page.getByRole("tab", { name: "カルテ" }).click();
  }

  await expect(
    page.locator('[data-slot="card-title"]').filter({ hasText: "カルテ" }),
  ).toBeVisible();
  // default テナントは stores / memberships 有効。memberships 有効時はプレースホルダ非表示
  await expect(page.getByRole("heading", { name: "在籍店舗" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "入会管理" })).toBeVisible();
  if (!tenantConfig.plugins.includes("appointments")) {
    await expect(page.getByText("予約プラグイン（準備中）")).toBeVisible();
  }
  if (!tenantConfig.plugins.includes("session-log")) {
    await expect(
      page.getByText("セッション記録プラグイン（準備中）"),
    ).toBeVisible();
  }
});

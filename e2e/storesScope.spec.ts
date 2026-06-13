import type { Page } from "@playwright/test";

import { test, expect } from "./fixtures";
import { ja } from "./ja";
import {
  goToContactsList,
  goToStoresList,
  openNewContactForm,
  openNewStoreForm,
} from "./storeHelpers";

const E2E_BASE = "http://localhost:5175";

async function login(page: Page, email: string) {
  await page.goto(`${E2E_BASE}/`);
  await page.getByLabel(ja.email).fill(email);
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.signIn }).click();
  await page.waitForLoadState("networkidle");
}

async function logout(page: Page) {
  await page.locator("header button.rounded-full").first().click();
  await page.getByText(ja.logout, { exact: true }).click();
  await expect(page.getByLabel(ja.email)).toBeVisible({ timeout: 10000 });
}

test.describe("店舗スコープ RLS", () => {
  test.skip(({ isMobile }) => isMobile, "スタッフ編集はデスクトップのみ");

  test("担当店舗の会員のみ一般スタッフに表示される", async ({
    page,
    createSales,
    assignSalesStore,
    dismissToast,
  }) => {
    await createSales({
      first_name: "Admin",
      last_name: "User",
      email: "scope-admin@example.com",
      password: "password",
      administrator: true,
    });

    const staff = await createSales({
      first_name: "Staff",
      last_name: "Funabashi",
      email: "scope-staff@example.com",
      password: "password",
      administrator: false,
    });

    await login(page, "scope-admin@example.com");

    await goToStoresList(page);
    await openNewStoreForm(page);
    await page.getByLabel(ja.storeName).fill("船橋店");
    await page.getByRole("button", { name: ja.createStore }).click();
    await dismissToast(ja.createdToast);

    await goToStoresList(page);
    await openNewStoreForm(page);
    await page.getByLabel(ja.storeName).fill("千葉店");
    await page.getByRole("button", { name: ja.createStore }).click();
    await dismissToast(ja.createdToast);

    await page.goto(`${E2E_BASE}/#/sales/${staff.id}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("担当店舗")).toBeVisible();

    await assignSalesStore({
      salesEmail: "scope-staff@example.com",
      storeName: "船橋店",
    });

    await openNewContactForm(page, false);
    await page.getByLabel(ja.femalePronoun).click();
    await page.getByLabel(ja.firstName).fill("船橋");
    await page.getByLabel(ja.lastName).fill("会員");
    await page.getByLabel(ja.memberStore).click();
    await page.getByRole("option", { name: "船橋店" }).click();
    await page.getByRole("button", { name: ja.save }).click();
    await dismissToast(ja.createdToast);

    await openNewContactForm(page, false);
    await page.getByLabel(ja.femalePronoun).click();
    await page.getByLabel(ja.firstName).fill("千葉");
    await page.getByLabel(ja.lastName).fill("会員");
    await page.getByLabel(ja.memberStore).click();
    await page.getByRole("option", { name: "千葉店" }).click();
    await page.getByRole("button", { name: ja.save }).click();
    await dismissToast(ja.createdToast);

    await logout(page);
    await login(page, "scope-staff@example.com");

    await goToContactsList(page);
    await expect(page.getByText("船橋 会員")).toBeVisible();
    await expect(page.getByText("千葉 会員")).not.toBeVisible();
  });
});

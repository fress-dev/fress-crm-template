import { test, expect } from "./fixtures";
import { ja } from "./ja";
import {
  goToContactsList,
  goToStoresList,
  openNewContactForm,
  openNewStoreForm,
} from "./storeHelpers";

test("store CRUD and contact store assignment", async ({
  page,
  isMobile,
  createSales,
  dismissToast,
}) => {
  await createSales({
    first_name: "Store",
    last_name: "Admin",
    email: "store-admin@example.com",
    password: "password",
  });

  await page.goto("http://localhost:5175/");
  await page.getByLabel(ja.email).fill("store-admin@example.com");
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.signIn }).click();
  await page.waitForLoadState("networkidle");

  await goToStoresList(page);
  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill("船橋店");
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await expect(page.getByText("船橋店", { exact: true })).toBeVisible();

  await goToStoresList(page);
  await expect(page.getByRole("cell", { name: "船橋店" })).toBeVisible();

  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill("千葉店");
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await goToStoresList(page);
  await expect(page.getByRole("cell", { name: "千葉店" })).toBeVisible();

  await page.getByPlaceholder(ja.search).fill("船橋");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("cell", { name: "船橋店" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "千葉店" })).not.toBeVisible();

  await page.getByPlaceholder(ja.search).fill("");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("cell", { name: "千葉店" })).toBeVisible();

  await openNewContactForm(page, isMobile);

  await page.getByLabel(ja.femalePronoun).click();
  await page.getByLabel(ja.firstName).fill("会員");
  await page.getByLabel(ja.lastName).fill("太郎");
  await page.getByLabel(ja.memberStore).click();
  await page.getByRole("option", { name: "船橋店" }).click();

  await page.getByRole("button", { name: ja.save }).click();
  await dismissToast(ja.createdToast);

  await goToContactsList(page);
  await expect(page.getByText("会員 太郎")).toBeVisible();
});

import { test, expect } from "./fixtures";
import { ja } from "./ja";
import { goToStoresList, openNewStoreForm } from "./storeHelpers";

test("store form validation", async ({ page, createSales }) => {
  await createSales({
    first_name: "Store",
    last_name: "Validator",
    email: "store-validator@example.com",
    password: "password",
  });

  await page.goto("http://localhost:5175/");
  await page.getByLabel(ja.email).fill("store-validator@example.com");
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.signIn }).click();
  await page.waitForLoadState("networkidle");

  await goToStoresList(page);
  await openNewStoreForm(page);

  await page.getByLabel(ja.storeName).fill("検証用店舗");
  await page.getByLabel(ja.zipLabel).fill("wq");
  await page.getByRole("button", { name: ja.createStore }).click();

  await expect(page.getByText(ja.zipFormatError)).toBeVisible();

  await page.getByLabel(ja.zipLabel).fill("123-4567");
  await page.getByRole("button", { name: ja.createStore }).click();
  await expect(page.getByText(ja.createdToast)).toBeVisible();

  await goToStoresList(page);
  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill("検証用店舗");
  await page.getByRole("button", { name: ja.createStore }).click();

  await expect(page.getByText(ja.duplicateStoreError)).toBeVisible();
});

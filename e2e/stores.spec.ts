import { test, expect } from "./fixtures";
import { ja } from "./ja";

test("store CRUD and contact store filter", async ({
  page,
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

  await page.getByRole("link", { name: ja.stores }).click();
  await page.waitForLoadState("networkidle");

  await page.getByRole("link", { name: ja.newStore }).click();
  await page.getByLabel(ja.storeName).fill("船橋店");
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await expect(page.getByRole("cell", { name: "船橋店" })).toBeVisible();

  await page.getByRole("link", { name: ja.newStore }).click();
  await page.getByLabel(ja.storeName).fill("千葉店");
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await page.getByRole("link", { name: ja.contacts }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: ja.newContact }).click();
  await page.waitForLoadState("networkidle");

  await page.getByLabel(ja.femalePronoun).click();
  await page.getByLabel(ja.firstName).fill("会員");
  await page.getByLabel(ja.lastName).fill("太郎");
  await page.getByLabel(ja.memberStore).click();
  await page.getByRole("option", { name: "船橋店" }).click();

  await page.getByLabel(`${ja.accountManager} *`).click();
  await page.getByRole("option", { name: "Store Admin" }).click();

  await page.getByRole("button", { name: ja.save }).click();
  await dismissToast(ja.createdToast);

  await page.getByRole("link", { name: ja.contacts }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "船橋店" }).click();
  await page.waitForLoadState("networkidle");

  await expect(page.getByText("会員 太郎")).toBeVisible();

  await page.getByRole("button", { name: "千葉店" }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("会員 太郎")).not.toBeVisible();
});

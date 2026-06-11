import { test, expect } from "./fixtures";
import { ja } from "./ja";
import {
  goToContactsList,
  goToStoresList,
  openNewStoreForm,
} from "./storeHelpers";

test("store soft delete", async ({
  page,
  isMobile,
  createSales,
  dismissToast,
}) => {
  const storeName = "論理削除テスト店";

  await createSales({
    first_name: "Store",
    last_name: "Admin",
    email: "soft-delete-admin@example.com",
    password: "password",
    administrator: true,
  });

  await page.goto("http://localhost:5175/");
  await page.getByLabel(ja.email).fill("soft-delete-admin@example.com");
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.signIn }).click();
  await page.waitForLoadState("networkidle");

  await goToStoresList(page);
  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill(storeName);
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await goToContactsList(page);
  if (isMobile) {
    await page.getByRole("button", { name: ja.newContact }).click();
  } else {
    await page.getByRole("link", { name: ja.newContact }).click();
  }
  await page.waitForLoadState("networkidle");

  await page.getByLabel(ja.femalePronoun).click();
  await page.getByLabel(ja.firstName).fill("論理");
  await page.getByLabel(ja.lastName).fill("削除");
  await page.getByLabel(ja.memberStore).click();
  await page.getByRole("option", { name: storeName }).click();
  await page.getByRole("button", { name: ja.save }).click();
  await dismissToast(ja.createdToast);

  await goToStoresList(page);
  await page.getByRole("cell", { name: storeName }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: ja.delete }).click();
  await expect(page.getByText(ja.softDeleteStoreConfirm)).toBeVisible();
  await page.getByRole("button", { name: ja.confirm }).click();
  await dismissToast("削除しました");

  await goToStoresList(page);
  await expect(page.getByRole("cell", { name: storeName })).not.toBeVisible();

  await goToContactsList(page);
  await page.getByText("論理 削除").click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: ja.editContact }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByLabel(ja.memberStore)).toContainText(storeName);

  if (isMobile) {
    await page.getByRole("button", { name: ja.newContact }).click();
  } else {
    await page.getByRole("link", { name: ja.newContact }).click();
  }
  await page.waitForLoadState("networkidle");
  await page.getByLabel(ja.memberStore).click();
  await expect(page.getByRole("option", { name: storeName })).not.toBeVisible();

  await goToStoresList(page);
  await page.getByRole("button", { name: ja.includeDeletedStores }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("cell", { name: storeName })).toBeVisible();
  await expect(page.getByText(ja.deletedStoreBadge)).toBeVisible();

  await page.getByRole("button", { name: ja.includeDeletedStores }).click();
  await page.waitForLoadState("networkidle");

  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill(storeName);
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await goToStoresList(page);
  await expect(page.getByRole("cell", { name: storeName })).toBeVisible();
});

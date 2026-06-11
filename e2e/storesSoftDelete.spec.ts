import { test, expect, type Page } from "./fixtures";
import { ja } from "./ja";
import {
  goToContactsList,
  goToStoresList,
  openNewContactForm,
  openNewContactFormOnMobileList,
  openNewStoreForm,
} from "./storeHelpers";

const E2E_BASE = "http://localhost:5175";

const deletedStoreBadge = (page: Page) =>
  page.getByText(ja.deletedStoreBadge, { exact: true });

const clickIncludeDeletedStores = async (
  page: Page,
  expectDeletedVisible: boolean,
) => {
  const toggle = page.getByRole("button", { name: ja.includeDeletedStores });
  await expect(toggle).toBeVisible({ timeout: 15000 });
  await toggle.click();
  if (expectDeletedVisible) {
    await expect(deletedStoreBadge(page)).toBeVisible({ timeout: 15000 });
  } else {
    await expect(deletedStoreBadge(page)).not.toBeVisible({ timeout: 15000 });
  }
};

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

  await openNewContactForm(page, isMobile);
  await expect(page.getByLabel(ja.femalePronoun)).toBeVisible({
    timeout: 15000,
  });
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
  await page.getByRole("button", { name: ja.delete, exact: true }).click();
  const deleteDialog = page.getByRole("dialog");
  await expect(deleteDialog.getByText(ja.softDeleteStoreConfirm)).toBeVisible();
  await deleteDialog.getByRole("button", { name: ja.confirm }).click();
  await dismissToast("削除しました");

  await goToStoresList(page);
  await expect(page.getByRole("cell", { name: storeName })).not.toBeVisible();

  await goToContactsList(page);
  await page.getByText("論理 削除").click();
  await page.waitForLoadState("networkidle");

  if (isMobile) {
    await page.getByRole("button", { name: ja.edit }).click();
    await page.waitForLoadState("networkidle");
  } else {
    const contactId = page.url().match(/contacts\/(\d+)/)?.[1];
    if (!contactId) {
      throw new Error(`contact id not found in ${page.url()}`);
    }
    await page.goto(`${E2E_BASE}/#/contacts/${contactId}/edit`);
    await page.waitForLoadState("networkidle");
  }
  await expect(page.getByLabel(ja.memberStore)).toContainText(storeName);

  if (isMobile) {
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /Back/i }).click();
    await page.waitForLoadState("networkidle");
    await openNewContactFormOnMobileList(page);
  } else {
    await page.goto(`${E2E_BASE}/#/contacts/create`);
    await page.waitForLoadState("networkidle");
  }
  await expect(page.getByLabel(ja.memberStore)).toBeVisible({
    timeout: 15000,
  });
  await page.getByLabel(ja.memberStore).click();
  await expect(page.getByRole("option", { name: storeName })).not.toBeVisible();

  await goToStoresList(page);
  await clickIncludeDeletedStores(page, true);
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("cell", { name: storeName })).toBeVisible({
    timeout: 15000,
  });

  await clickIncludeDeletedStores(page, false);
  await page.waitForLoadState("networkidle");

  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill(storeName);
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await goToStoresList(page);
  await expect(page.getByRole("cell", { name: storeName })).toBeVisible();
});

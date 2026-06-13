import { test, expect, type Page } from "./fixtures";
import { ja } from "./ja";
import { goToRoomsList, openNewRoomForm } from "./roomHelpers";
import { goToStoresList, openNewStoreForm } from "./storeHelpers";

const clickIncludeDeletedRooms = async (page: Page, isMobile: boolean) => {
  const toggle = page.getByRole("button", { name: ja.includeDeletedRooms });
  await expect(toggle).toBeVisible({ timeout: 15000 });
  await toggle.scrollIntoViewIfNeeded();
  if (isMobile) {
    await toggle.evaluate((node) => {
      (node as HTMLButtonElement).click();
    });
  } else {
    await toggle.click({ timeout: 15000 });
  }
  await page.waitForLoadState("networkidle");
};

test("room CRUD with store filter and search", async ({
  page,
  createSales,
  dismissToast,
}) => {
  await createSales({
    first_name: "Room",
    last_name: "Admin",
    email: "room-admin@example.com",
    password: "password",
    administrator: true,
  });

  await page.goto("http://localhost:5175/");
  await page.getByLabel(ja.email).fill("room-admin@example.com");
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.signIn }).click();
  await page.waitForLoadState("networkidle");

  await goToStoresList(page);
  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill("部屋テスト店");
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await goToStoresList(page);
  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill("別店舗");
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await goToRoomsList(page);
  await openNewRoomForm(page);
  await page.getByRole("combobox", { name: ja.roomStore }).click();
  await page.getByRole("option", { name: "部屋テスト店" }).click();
  await page.getByLabel(ja.roomName).fill("ルーム A");
  await expect(page.getByRole("button", { name: ja.createRoom })).toBeEnabled({
    timeout: 15000,
  });
  await page.getByRole("button", { name: ja.createRoom }).click();
  await dismissToast(ja.createdToast);

  await expect(page.getByText("ルーム A", { exact: true })).toBeVisible();
  await expect(page.getByText("部屋テスト店", { exact: true })).toBeVisible();

  await goToRoomsList(page);
  await expect(page.getByRole("cell", { name: "ルーム A" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "部屋テスト店" })).toBeVisible();

  await page.getByRole("combobox", { name: ja.roomStore }).click();
  await page.getByRole("option", { name: "部屋テスト店" }).click();
  await page.keyboard.press("Escape");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("cell", { name: "ルーム A" })).toBeVisible();

  await page.locator('input[name="q"]').fill("ルーム");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("cell", { name: "ルーム A" })).toBeVisible();

  await page.getByRole("cell", { name: "ルーム A" }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: ja.edit }).click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel(ja.roomName).fill("ルーム A 改");
  await page.getByRole("button", { name: ja.save }).click();
  await dismissToast(ja.updatedToast);

  await goToRoomsList(page);
  await expect(page.getByRole("cell", { name: "ルーム A 改" })).toBeVisible();
});

test("room soft delete and duplicate name validation", async ({
  page,
  isMobile,
  createSales,
  dismissToast,
}) => {
  const roomName = "論理削除ルーム";

  await createSales({
    first_name: "Room",
    last_name: "Validator",
    email: "room-validator@example.com",
    password: "password",
    administrator: true,
  });

  await page.goto("http://localhost:5175/");
  await page.getByLabel(ja.email).fill("room-validator@example.com");
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.signIn }).click();
  await page.waitForLoadState("networkidle");

  await goToStoresList(page);
  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill("重複テスト店");
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await goToRoomsList(page);
  await openNewRoomForm(page);
  await page.getByRole("combobox", { name: ja.roomStore }).click();
  await page.getByRole("option", { name: "重複テスト店" }).click();
  await page.getByLabel(ja.roomName).fill(roomName);
  await expect(page.getByRole("button", { name: ja.createRoom })).toBeEnabled({
    timeout: 15000,
  });
  await page.getByRole("button", { name: ja.createRoom }).click();
  await dismissToast(ja.createdToast);

  await goToRoomsList(page);
  await openNewRoomForm(page);
  await page.getByRole("combobox", { name: ja.roomStore }).click();
  await page.getByRole("option", { name: "重複テスト店" }).click();
  await page.getByLabel(ja.roomName).fill(roomName);
  await expect(page.getByRole("button", { name: ja.createRoom })).toBeEnabled({
    timeout: 15000,
  });
  await page.getByRole("button", { name: ja.createRoom }).click();
  await expect(page.getByText(ja.duplicateRoomError)).toBeVisible();

  await goToRoomsList(page);
  await page.getByRole("cell", { name: roomName }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: ja.delete, exact: true }).click();
  const deleteDialog = page.getByRole("dialog");
  await expect(deleteDialog.getByText(ja.softDeleteRoomConfirm)).toBeVisible();
  await deleteDialog.getByRole("button", { name: ja.confirm }).click();
  await dismissToast("削除しました");

  await goToRoomsList(page);
  await expect(page.getByRole("cell", { name: roomName })).not.toBeVisible();

  if (!isMobile) {
    await clickIncludeDeletedRooms(page, isMobile);
    await expect(page.getByRole("cell", { name: roomName })).toBeVisible();
    await clickIncludeDeletedRooms(page, isMobile);
    await expect(page.getByRole("cell", { name: roomName })).not.toBeVisible();
  }
});

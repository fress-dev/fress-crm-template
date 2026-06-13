import { type Page } from "@playwright/test";

import { ja } from "./ja";

const E2E_BASE = "http://localhost:5175";

/** 部屋一覧へ遷移する */
export async function goToRoomsList(page: Page) {
  await page.goto(`${E2E_BASE}/#/rooms`);
  await page.waitForLoadState("networkidle");
}

/** 空一覧は「部屋を登録」、一覧ツールバーは「新しい部屋」 */
export async function openNewRoomForm(page: Page) {
  const createLink = page
    .getByRole("link", { name: ja.newRoom })
    .or(page.getByRole("link", { name: ja.createRoom }));

  if (await createLink.first().isVisible()) {
    try {
      await createLink.first().click({ timeout: 5000 });
      await page.waitForLoadState("networkidle");
      return;
    } catch {
      // モバイル等でクリックできない場合は URL 直指定へフォールバック
    }
  }

  await page.goto(`${E2E_BASE}/#/rooms/create`);
  await page.waitForLoadState("networkidle");
}

import type { Page } from "@playwright/test";

import { ja } from "./ja";

const E2E_BASE = "http://localhost:5175";

/** 店舗一覧へ遷移する（作成後は show にリダイレクトされるため一覧へ戻す） */
export async function goToStoresList(page: Page) {
  await page.goto(`${E2E_BASE}/#/stores`);
  await page.waitForLoadState("networkidle");
}

/** 担当者一覧へ遷移する */
export async function goToContactsList(page: Page) {
  await page.goto(`${E2E_BASE}/#/contacts`);
  await page.waitForLoadState("networkidle");
}

/** 空一覧は「店舗を登録」、一覧ツールバーは「新しい店舗」 */
export async function openNewStoreForm(page: Page) {
  const createLink = page
    .getByRole("link", { name: ja.newStore })
    .or(page.getByRole("link", { name: ja.createStore }));

  if (await createLink.first().isVisible()) {
    await createLink.first().click();
    return;
  }

  await page.goto(`${E2E_BASE}/#/stores/create`);
  await page.waitForLoadState("networkidle");
}

/** 担当者作成フォームを開く */
export async function openNewContactForm(page: Page, _isMobile: boolean) {
  await page.goto(`${E2E_BASE}/#/contacts/create`);
  await page.waitForLoadState("networkidle");
}

/** 会員一覧の在籍店舗フィルタ（モバイルはフィルタシート経由） */
export async function applyContactStoreFilter(
  page: Page,
  storeName: string,
  isMobile: boolean,
) {
  if (isMobile) {
    await page.getByRole("button", { name: ja.filterConditions }).click();
    await page.getByRole("button", { name: storeName }).click();
    await page.getByRole("button", { name: ja.confirm }).click();
  } else {
    await page.getByRole("button", { name: storeName }).click();
  }
  await page.waitForLoadState("networkidle");
}

import { type Page } from "@playwright/test";

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

/** コース一覧へ遷移する */
export async function goToCoursesList(page: Page) {
  await page.goto(`${E2E_BASE}/#/courses`);
  await page.waitForLoadState("networkidle");
}

/** 空一覧は「店舗を登録」、一覧ツールバーは「新しい店舗」 */
export async function openNewStoreForm(page: Page) {
  const createLink = page
    .getByRole("link", { name: ja.newStore })
    .or(page.getByRole("link", { name: ja.createStore }));

  if (await createLink.first().isVisible()) {
    try {
      await createLink.first().click({ timeout: 5000 });
      await page.waitForLoadState("networkidle");
      return;
    } catch {
      // モバイル等でクリックできない場合は URL 直指定へフォールバック
    }
  }

  await page.goto(`${E2E_BASE}/#/stores/create`);
  await page.waitForLoadState("networkidle");
}

/** 担当者作成フォームを開く（モバイルは空一覧と FAB の両方に対応） */
export async function openNewContactForm(page: Page, isMobile: boolean) {
  if (isMobile) {
    await goToContactsList(page);
    await openNewContactFormOnMobileList(page);
  } else {
    await page.goto(`${E2E_BASE}/#/contacts/create`);
    await page.waitForLoadState("networkidle");
  }
}

/** 担当者一覧上で新規作成シートを開く（遷移済み前提） */
export async function openNewContactFormOnMobileList(page: Page) {
  const emptyCreate = page
    .getByRole("button", { name: ja.newContact })
    .or(page.getByRole("link", { name: ja.newContact }));

  if (await emptyCreate.first().isVisible()) {
    await emptyCreate.first().click();
  } else {
    await page.getByRole("button", { name: ja.create }).click();
    await page
      .getByRole("menuitem", { name: ja.contactForcedCaseName })
      .click();
  }
  await page.waitForLoadState("networkidle");
}

/** 空一覧は「コースを登録」、一覧ツールバーは「新しいコース」 */
export async function openNewCourseForm(page: Page) {
  const createLink = page
    .getByRole("link", { name: ja.newCourse })
    .or(page.getByRole("link", { name: ja.createCourse }));

  if (await createLink.first().isVisible()) {
    try {
      await createLink.first().click({ timeout: 5000 });
      await page.waitForLoadState("networkidle");
      return;
    } catch {
      // モバイル等でクリックできない場合は URL 直指定へフォールバック
    }
  }

  await page.goto(`${E2E_BASE}/#/courses/create`);
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

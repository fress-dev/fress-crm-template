import type { Page } from "./fixtures";
import { ja } from "./ja";

const E2E_BASE = "http://localhost:5175";

/** 予約一覧へ遷移する */
export const goToAppointmentsList = async (page: Page) => {
  await page.goto(`${E2E_BASE}/#/appointments`);
  await page.waitForLoadState("networkidle");
};

/** 空一覧は「予約を登録」、一覧ツールバーは「新しい予約」 */
export const openNewAppointmentForm = async (page: Page) => {
  const createLink = page
    .getByRole("link", { name: ja.newAppointment })
    .or(page.getByRole("link", { name: ja.createAppointment }));

  if (await createLink.first().isVisible()) {
    try {
      await createLink.first().click({ timeout: 5000 });
      await page.waitForLoadState("networkidle");
      return;
    } catch {
      // クリックできない場合は URL 直指定へフォールバック
    }
  }

  await page.goto(`${E2E_BASE}/#/appointments/create`);
  await page.waitForLoadState("networkidle");
};

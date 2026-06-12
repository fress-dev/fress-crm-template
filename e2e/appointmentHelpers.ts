import type { Page } from "./fixtures";
import { ja } from "./ja";

export const goToAppointmentsList = async (page: Page) => {
  await page.getByRole("link", { name: ja.appointments }).click();
  await page.waitForLoadState("networkidle");
};

export const openNewAppointmentForm = async (page: Page) => {
  await page.getByRole("link", { name: ja.newAppointment }).click();
  await page.waitForLoadState("networkidle");
};

import { test, expect } from "./fixtures";
import { ja } from "./ja";
import {
  goToContactsList,
  goToStoresList,
  openNewContactForm,
  openNewStoreForm,
} from "./storeHelpers";
import {
  goToAppointmentsList,
  openNewAppointmentForm,
} from "./appointmentHelpers";

const toDatetimeLocal = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

test("appointment CRUD and filters", async ({
  page,
  isMobile,
  createSales,
  dismissToast,
}) => {
  test.skip(isMobile, "予約 CRUD の主要検証は desktop で行う");

  await createSales({
    first_name: "予約",
    last_name: "担当",
    email: "appointment-admin@example.com",
    password: "password",
  });

  await page.goto("http://localhost:5175/");
  await page.getByLabel(ja.email).fill("appointment-admin@example.com");
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.signIn }).click();
  await page.waitForLoadState("networkidle");

  await goToStoresList(page);
  await openNewStoreForm(page);
  await page.getByLabel(ja.storeName).fill("予約テスト店");
  await page.getByRole("button", { name: ja.createStore }).click();
  await dismissToast(ja.createdToast);

  await goToContactsList(page);
  await openNewContactForm(page);
  await page.getByLabel(ja.femalePronoun).click();
  await page.getByLabel(ja.firstName).fill("予約");
  await page.getByLabel(ja.lastName).fill("会員");
  await page.getByRole("button", { name: ja.save }).click();
  await dismissToast(ja.createdToast);

  await goToAppointmentsList(page);
  await openNewAppointmentForm(page);

  await page.getByLabel(ja.appointmentContact).click();
  await page.getByRole("option", { name: "予約 会員" }).click();
  await page.getByLabel(ja.appointmentSales).click();
  await page.getByRole("option", { name: "予約 担当" }).click();
  await page.getByLabel(ja.appointmentStore).click();
  await page.getByRole("option", { name: "予約テスト店" }).click();
  await page.getByLabel(ja.appointmentType).click();
  await page.getByRole("option", { name: ja.appointmentTypeTrial }).click();

  const start = new Date();
  start.setHours(10, 0, 0, 0);
  const end = new Date(start);
  end.setHours(11, 0, 0, 0);

  await page.getByLabel(ja.appointmentStartAt).fill(toDatetimeLocal(start));
  await page.getByLabel(ja.appointmentEndAt).fill(toDatetimeLocal(end));
  await page.getByLabel(ja.appointmentTitle).fill("体験予約テスト");

  await page.getByRole("button", { name: ja.createAppointment }).click();
  await dismissToast(ja.createdToast);

  await goToAppointmentsList(page);
  await expect(
    page.getByRole("cell", { name: "体験予約テスト" }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: ja.appointmentTypeTrial }),
  ).toBeVisible();

  await page.getByPlaceholder(ja.search).fill("体験予約");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("cell", { name: "体験予約テスト" }),
  ).toBeVisible();

  await page.getByRole("cell", { name: "体験予約テスト" }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: ja.edit }).click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel(ja.appointmentTitle).fill("体験予約更新");
  await page.getByRole("button", { name: ja.save }).click();
  await dismissToast(ja.updatedToast);

  await goToAppointmentsList(page);
  await expect(page.getByRole("cell", { name: "体験予約更新" })).toBeVisible();

  await page.getByRole("cell", { name: "体験予約更新" }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: ja.delete }).click();
  await page.getByRole("button", { name: ja.confirm }).click();
  await dismissToast(ja.deletedToast);

  await goToAppointmentsList(page);
  await expect(
    page.getByRole("cell", { name: "体験予約更新" }),
  ).not.toBeVisible();
});

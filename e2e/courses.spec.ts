import { test, expect } from "./fixtures";
import { ja } from "./ja";
import { goToCoursesList, openNewCourseForm } from "./storeHelpers";

test("course list, search, create, update, and delete", async ({
  page,
  createSales,
  createCourse,
  dismissToast,
}) => {
  await createSales({
    first_name: "Course",
    last_name: "Admin",
    email: "course-admin@example.com",
    password: "password",
  });
  await createCourse({ name: "E2E パーソナル 60分", display_order: 10 });
  await createCourse({
    name: "E2E ストレッチ 30分",
    service_kind: "stretch",
    duration_minutes: 30,
    display_order: 20,
  });

  await page.goto("http://localhost:5175/");
  await page
    .getByLabel(/メールアドレス|Email/i)
    .fill("course-admin@example.com");
  await page.getByLabel(/パスワード|Password/i).fill("password");
  await page.getByRole("button", { name: /ログイン|Sign in/i }).click();
  await expect(
    page.getByRole("link", { name: /ダッシュボード|Dashboard/i }),
  ).toBeVisible();

  await goToCoursesList(page);
  await openNewCourseForm(page);
  await page.getByLabel(ja.courseName).fill("E2E UI パーソナル 45分");
  await page.getByRole("button", { name: ja.createCourse }).click();
  await expect(page.getByText(ja.createdToast)).toBeVisible();
  await dismissToast(ja.createdToast);

  await goToCoursesList(page);
  await expect(
    page.getByRole("cell", { name: "E2E UI パーソナル 45分" }),
  ).toBeVisible();

  await page.getByPlaceholder(ja.search).fill("ストレッチ");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("cell", { name: "E2E ストレッチ 30分" }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "E2E パーソナル 60分" }),
  ).not.toBeVisible();

  await page.getByPlaceholder(ja.search).fill("存在しないコース名");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("cell", { name: "E2E パーソナル 60分" }),
  ).not.toBeVisible();
  await expect(
    page.getByRole("cell", { name: "E2E ストレッチ 30分" }),
  ).not.toBeVisible();
  await expect(
    page.getByRole("cell", { name: "E2E UI パーソナル 45分" }),
  ).not.toBeVisible();

  await page.getByPlaceholder(ja.search).fill("");
  await page.waitForLoadState("networkidle");
  await page.getByRole("cell", { name: "E2E UI パーソナル 45分" }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: ja.edit }).click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel(ja.displayOrder).click();
  await page.getByLabel(ja.displayOrder).fill("50");
  await expect(page.getByRole("button", { name: ja.save })).toBeEnabled();
  await page.getByRole("button", { name: ja.save }).click();
  await expect(page.getByText(ja.updatedToast)).toBeVisible();
  await dismissToast(ja.updatedToast);

  await goToCoursesList(page);
  await page.getByRole("cell", { name: "E2E パーソナル 60分" }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "削除" }).click();
  await page.getByRole("button", { name: ja.confirm }).click();
  await goToCoursesList(page);
  await expect(
    page.getByRole("cell", { name: "E2E パーソナル 60分" }),
  ).not.toBeVisible();
});

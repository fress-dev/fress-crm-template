import { test, expect } from "./fixtures";

test("membership list and show tickets", async ({
  page,
  createSales,
  createStore,
  createCourse,
  createContact,
  createMembership,
}) => {
  const sales = await createSales({
    first_name: "Membership",
    last_name: "Admin",
    email: "membership-admin@example.com",
    password: "password",
  });
  const store = await createStore({ name: "E2E 契約店舗" });
  const course = await createCourse({ name: "E2E 回数券 8回" });
  const contact = await createContact({
    first_name: "太郎",
    last_name: "会員",
    sales_id: sales.id,
    store_id: store.id,
  });
  const membership = await createMembership({
    contact_id: contact.id,
    course_id: course.id,
    store_id: store.id,
    ticket_count: 3,
  });

  await page.goto("http://localhost:5175/");
  await page
    .getByLabel(/メールアドレス|Email/i)
    .fill("membership-admin@example.com");
  await page.getByLabel(/パスワード|Password/i).fill("password");
  await page.getByRole("button", { name: /ログイン|Sign in/i }).click();
  await expect(
    page.getByRole("link", { name: /ダッシュボード|Dashboard/i }),
  ).toBeVisible();

  await page.goto("http://localhost:5175/#/memberships");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("cell", { name: "会員" })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "E2E 回数券 8回" }),
  ).toBeVisible();

  await page.goto(`http://localhost:5175/#/memberships/${membership.id}/show`);
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("回数券一覧")).toBeVisible();
  await expect(page.getByRole("cell", { name: "1" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "3" })).toBeVisible();
});

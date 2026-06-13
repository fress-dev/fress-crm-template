import { expect, test } from "./fixtures";
import { ja } from "./ja";

test.describe("user adding a task", () => {
  test.beforeEach(async ({ createSales, createContact, createCompany }) => {
    const sales = await createSales({
      first_name: "John",
      last_name: "Doe",
      email: "john-task@example.com",
      password: "password",
    });

    const company = await createCompany({
      name: "Smith Corp",
      salesId: sales.id,
    });

    await createContact({
      first_name: "Jane",
      last_name: "Smith",
      title: "CEO",
      sales_id: sales.id,
      company_id: company.id,
      notes: [{ text: "Met at a conference." }],
    });

    await createContact({
      first_name: "Bob",
      last_name: "Johnson",
      title: "CTO",
      sales_id: sales.id,
      company_id: company.id,
    });

    await createContact({
      first_name: "Alice",
      last_name: "Williams",
      title: "CFO",
      sales_id: sales.id,
      company_id: company.id,
    });
  });
  test("user adding a task", async ({ page, isMobile, menu, dismissToast }) => {
    await page.goto("http://localhost:5175/");
    await page.getByLabel(ja.email).fill("john-task@example.com");
    await page.getByLabel(ja.password).fill("password");
    await page.getByRole("button", { name: ja.signIn }).click();

    await expect(page).toHaveTitle(new RegExp(ja.appTitle));
    await expect(page.getByText(ja.latestActivity)).toBeVisible();

    await menu.goToContacts();
    await page.waitForLoadState("networkidle");

    await page.getByText("Jane Smith").click();
    await page.waitForLoadState("networkidle");

    if (isMobile) {
      await page.getByRole("button", { name: ja.create }).click();
      await page.getByRole("menuitem", { name: ja.task }).click();
    } else {
      await page.getByRole("button", { name: ja.addTask }).click();
    }
    await page.getByLabel(`${ja.description} *`).fill("Follow up with Jane");
    await page.getByLabel(ja.dueDate).fill("2026-04-11T21:00");
    await page.getByLabel(ja.type).click();
    await page.getByRole("option", { name: ja.call }).click();

    await page.getByRole("button", { name: ja.save }).click();

    await dismissToast(ja.taskAddedToast);

    if (isMobile) {
      await expect(page.getByText(ja.taskCount(1))).toBeVisible();
      await page.getByText(ja.taskCount(1)).click();

      await expect(page.getByText("Follow up with Jane")).toBeVisible();
      await expect(page.getByText(/2026/)).toBeVisible();
    } else {
      const tasksHeading = page.getByRole("heading", { name: ja.tasks });
      await expect(tasksHeading).toBeVisible();

      await expect(tasksHeading.locator("..")).toHaveText(
        /Follow up with Jane/,
      );
      await menu.goToDashboard();

      await expect(page.getByText(ja.upcomingTasks)).toBeVisible();
      await expect(
        page.getByText(ja.upcomingTasks).locator("../.."),
      ).toHaveText(/Follow up with Jane/);
      await expect(
        page.getByText("Follow up with Jane").locator(".."),
      ).toHaveText(
        /電話.*Follow up with Jane.*期限.*2026.*Jane Smithさんについて/,
      );
    }
  });
});

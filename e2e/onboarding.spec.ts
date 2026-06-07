import { test, expect } from "./fixtures";
import { ja } from "./ja";

test("user onboarding", async ({ page, isMobile, menu, dismissToast }) => {
  await page.goto("http://localhost:5175/");

  await expect(page).toHaveTitle(new RegExp(ja.appTitle));
  await expect(page.getByText(ja.welcomeTitle)).toBeVisible();

  await page.getByLabel(ja.firstName).fill("John");
  await page.getByLabel(ja.lastName).fill("Doe");
  await page.getByLabel(ja.email).fill("john@doe.com");
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.createAccount }).click();

  await expect(page.getByText(ja.whatsNext)).toBeVisible();
  await expect(page.getByText(ja.stepDone(1))).toBeVisible();
  await expect(page.getByText(ja.installApp)).toBeVisible();
  await expect(page.getByText(ja.addFirstContact)).toBeVisible();
  await expect(page.getByText(ja.addFirstNote)).toBeVisible();

  await page.getByText(ja.newContact).click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel(ja.femalePronoun).click();
  await page.getByLabel(ja.firstName).fill("Jane");
  await page.getByLabel(ja.lastName).fill("Smith");
  await page.getByLabel(ja.title).fill("CEO");
  await page.getByLabel(ja.company).click();
  await page.getByPlaceholder(ja.search).fill("Smith Corp");
  await page.getByText(ja.createCompany("Smith Corp")).click();
  await page
    .getByRole("group", { name: ja.emailAddresses })
    .getByRole("textbox", { name: ja.emailPlaceholder })
    .fill("jane@smithcorp.com");
  await page
    .getByRole("group", { name: ja.emailAddresses })
    .getByRole("button", { name: ja.add })
    .click();

  await page
    .getByRole("group", { name: ja.phoneNumbers })
    .getByRole("textbox", { name: ja.phonePlaceholder })
    .fill("+1234567890");
  await page
    .getByRole("group", { name: ja.phoneNumbers })
    .getByRole("button", { name: ja.add })
    .click();

  await page
    .getByLabel(ja.linkedIn)
    .fill("https://www.linkedin.com/in/jane-smith");

  await page.getByLabel(ja.background).fill("Met at a conference.");

  await page.getByLabel(ja.hasNewsletter).check();

  await expect(page.getByLabel(`${ja.accountManager} *`)).toHaveText(
    "John Doe",
  );

  await page.getByRole("button", { name: ja.save }).click();

  await dismissToast(ja.createdToast);

  await expect(page.locator(isMobile ? "h2" : "h5")).toHaveText("Jane Smith");
  await expect(page.getByText("CEO")).toBeVisible();
  await expect(page.getByText("Smith Corp")).toBeVisible();

  await menu.goToDashboard();
  await page.waitForLoadState("networkidle");

  await expect(page.getByText(ja.stepDone(2))).toBeVisible();

  await page.getByRole("button", { name: ja.addNote }).click();

  await page.waitForLoadState("networkidle");

  await page
    .getByPlaceholder(ja.addNotePlaceholder)
    .fill("This is a note about Jane.");
  await page
    .getByRole("button", { name: isMobile ? ja.save : ja.addThisNote })
    .click();

  await dismissToast(ja.noteAddedToast);

  await expect(
    page.getByText(isMobile ? ja.me : ja.youAddedNote, { exact: false }),
  ).toBeVisible();
  await expect(page.getByText("This is a note about Jane.")).toBeVisible();

  await menu.goToDashboard();

  await page.waitForLoadState("networkidle");

  const activitySection = page
    .getByText(ja.latestActivity)
    .locator("xpath=../..");

  await expect(page.getByText(ja.latestActivity)).toBeVisible();
  await expect(activitySection).toHaveText(/あなたが企業を登録/);
  await expect(activitySection).toHaveText(/Smith Corp/);
  await expect(activitySection).toHaveText(/あなたが担当者を追加/);
  await expect(activitySection).toHaveText(/Jane Smith/);
  await expect(activitySection).toHaveText(/あなたがメモを追加/);
});

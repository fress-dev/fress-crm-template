import { test, expect } from "./fixtures";
import { ja } from "./ja";
import {
  goToTrainingGroupsList,
  openNewTrainingGroupForm,
} from "./storeHelpers";

test("training group list, search, create, update, and delete", async ({
  page,
  createSales,
  createTrainingType,
  createTrainingGroup,
  dismissToast,
}) => {
  await createSales({
    first_name: "Training",
    last_name: "Admin",
    email: "training-admin@example.com",
    password: "password",
  });
  const backType = await createTrainingType({
    name: "E2E 背中",
    display_order: 10,
  });
  await createTrainingGroup({
    training_type_id: backType.id,
    name: "E2E デッドリフト",
    display_order: 10,
  });
  await createTrainingGroup({
    training_type_id: backType.id,
    name: "E2E チンニング",
    display_order: 20,
  });

  await page.goto("http://localhost:5175/");
  await page
    .getByLabel(/メールアドレス|Email/i)
    .fill("training-admin@example.com");
  await page.getByLabel(/パスワード|Password/i).fill("password");
  await page.getByRole("button", { name: /ログイン|Sign in/i }).click();
  await expect(
    page.getByRole("link", { name: /ダッシュボード|Dashboard/i }),
  ).toBeVisible();

  // UI から新しい種目を作成（カテゴリを選択）
  await goToTrainingGroupsList(page);
  await openNewTrainingGroupForm(page);
  await page.getByLabel(ja.trainingTypeField).click();
  await page.getByRole("option", { name: "E2E 背中" }).click();
  await page.getByLabel(ja.trainingGroupName).fill("E2E ラットプルダウン");
  await page.getByRole("button", { name: ja.createTrainingGroup }).click();
  await expect(page.getByText(ja.createdToast)).toBeVisible();
  await dismissToast(ja.createdToast);

  await goToTrainingGroupsList(page);
  await expect(
    page.getByRole("cell", { name: "E2E ラットプルダウン" }),
  ).toBeVisible();

  // 検索: ヒットあり
  await page.getByPlaceholder(ja.search).fill("デッドリフト");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("cell", { name: "E2E デッドリフト" }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "E2E チンニング" }),
  ).not.toBeVisible();

  // 検索: ヒットなし
  await page.getByPlaceholder(ja.search).fill("存在しない種目");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("cell", { name: "E2E デッドリフト" }),
  ).not.toBeVisible();
  await expect(
    page.getByRole("cell", { name: "E2E ラットプルダウン" }),
  ).not.toBeVisible();

  // 検索クリア → 編集（表示順を変更）
  await page.getByPlaceholder(ja.search).fill("");
  await page.waitForLoadState("networkidle");
  await page.getByRole("cell", { name: "E2E ラットプルダウン" }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: ja.edit }).click();
  await page.waitForLoadState("networkidle");
  await page.getByLabel(ja.displayOrder).click();
  await page.getByLabel(ja.displayOrder).fill("50");
  await expect(page.getByRole("button", { name: ja.save })).toBeEnabled();
  await page.getByRole("button", { name: ja.save }).click();
  await expect(page.getByText(ja.updatedToast)).toBeVisible();
  await dismissToast(ja.updatedToast);

  // 削除
  await goToTrainingGroupsList(page);
  await page.getByRole("cell", { name: "E2E デッドリフト" }).click();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: ja.delete }).click();
  await page.getByRole("button", { name: ja.confirm }).click();
  await goToTrainingGroupsList(page);
  await expect(
    page.getByRole("cell", { name: "E2E デッドリフト" }),
  ).not.toBeVisible();
});

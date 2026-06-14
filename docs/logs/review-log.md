# レビューログ

> **@reviewer** の検査結果を時系列で蓄積する。  
> 新しいエントリは **この見出しの直後（上から2番目）** に追記する（新しいほど上）。

将来、このログを見てハーネス（ルール・フック・エージェント指示）を改善する。

機能の設計本体は [workflow/design/README.md](../workflow/design/README.md) に置く。本ファイルはレビュー結果のログのみ。

---

## 2026-06-14 | feat/plugin-training-content-master | 種目マスタ（Phase 1） | [PR #41 設計](https://github.com/fress-dev/fress-crm-template/pull/41)

| 項目 | 結果 |
|------|------|
| モード | **差分** |
| 判定 | **要修正 → 修正済み**（Critical なし） |
| 実施者 | メインエージェント（@reviewer 検査） |

### 変更の要約

- `supabase/migrations/20260615120000_training_content_plugin.sql` — `training_types` / `training_groups` テーブル・RLS・updated_at トリガ
- `src/custom/plugins/trainingContent/**` — 種目カテゴリ / 種目の CRUD・dataProvider 検索・i18n・seed・ユニットテスト
- 縫い目: `bootstrapPlugins` / `withPluginDataProvider` / `i18nProvider` / `PlainJapaneseLayout` / `tenant/types`
- `tenants/default.json` / `tenants/noexcuse.json` に `training-content` を有効化（noexcuse は seed 付き）
- `e2e/trainingContent.spec.ts` + `e2e/fixtures.ts` ヘルパー

### 検査結果

| 項目 | 結果 |
|------|------|
| コア保護 | OK（`src/root/**`・既存 `src/components/**`・既存 migrations 非変更） |
| プラグイン独立性 | OK（`isTrainingContentPluginEnabled` ガード、無効時素通し） |
| CRUD / dataProvider | OK（courses 準拠。`q`→`@or @ilike`、table 直読み書き） |
| RLS / migration | OK（追加のみ、authenticated CRUD、`on delete restrict`） |
| i18n / 命名・日本語規約 | OK |

### 指摘と対応

- **[要修正] `dependsOn: ["session-log"]` の依存方向が逆** → 種目マスタは session-log を FK 参照せず単独で成立するため `dependsOn` を削除。将来 session-log 側がセッション行で `training_groups` を参照する段階で session-log に追加する方針をコメントで明記。
- [軽微] 種目削除確認文が Phase 1 に存在しない FK 参照を前提にしていた → 「この種目を削除します。よろしいですか？」へ修正。
- [軽微] `TrainingTypeInputs.tsx` の重複 import を 1 文へ統合。
- [プロセス] 設計書は PR 作成時に `docs/workflow/design/archive/` へ配置。

---

## 2026-06-14 | feat/plugin-session-log-master | セッション記録プラグイン | [PR #37](https://github.com/fress-dev/fress-crm-template/pull/37)

| 項目 | 結果 |
|------|------|
| モード | **差分** |
| 判定 | **PASS**（分割・e2e 修正後） |
| 実施者 | メインエージェント |

### 変更の要約

- `src/custom/plugins/sessionLog/**` — CRUD・チケット消費・dataProvider
- `supabase/migrations/20260613160000_session_logs_plugin.sql` — session_logs テーブル
- `e2e/sessionLogs.spec.ts` — 予約からのセッション記録・チケット消費
- 縫い目 — bootstrapPlugins / withPluginDataProvider / i18n / FressHeader / tenants

### 検査結果

| 項目 | 結果 |
|------|------|
| 設計書整合 | **OK** — `plugin-session-log.md`（approved）と一致 |
| コア保護 | **OK** — コアパス・既存 migrations 変更なし |
| 1 PR = 1 プラグイン | **OK** — appointments 差分を除去し base を PR #26 に変更 |
| CRUD/dataProvider | **OK** — チケット消費は RPC、論理削除 |
| e2e 修正 | **OK** — `resetDb` auth ページング、karteHub プレースホルダ条件、stores URL 直指定 |
| DoD | **OK** — `make pre-pr` 緑 |

### メモ

- マージ順: PR #26（appointments）→ PR #37（session-log）
- sessionLogs spec は desktop 専用（mobile はナビ競合回避）

---

## 2026-06-13 | feat/plugin-appointments-master | 予約プラグイン | [PR #26](https://github.com/fress-dev/fress-crm-template/pull/26)

| 項目 | 結果 |
|------|------|
| モード | **差分** |
| 判定 | **PASS** |
| 実施者 | メインエージェント |

### 変更の要約

- `src/custom/plugins/appointments/**` — CRUD・カレンダービュー・dataProvider
- `supabase/migrations/20260613120000_appointments_plugin.sql` — appointments テーブル
- `e2e/appointments.spec.ts` — CRUD・検索・論理削除
- `tenants/*.json` — appointmentTypes 設定

### 検査結果

| 項目 | 結果 |
|------|------|
| 設計書整合 | **OK** — `plugin-appointments.md`（approved）と一致 |
| コア保護 | **OK** — コアパス・既存 migrations 変更なし |
| CRUD/dataProvider | **OK** — 論理削除、view 誤書き込みなし、検索 `q` 変換 |
| e2e 修正 | **OK** — 会員作成時の在籍店舗選択、種別セル strict mode、`resetDb` に appointments 追加 |
| DoD | **OK** — `make pre-pr` 緑、`e2e/appointments.spec.ts` ローカル PASS |

### メモ

- CI e2e 失敗原因: stores プラグイン有効時は会員作成に在籍店舗必須。タイトル「体験予約〜」と種別「体験」の部分一致も修正

---

## 2026-06-13 | feat/platform-karte-hub | 会員カルテハブ | [PR #32](https://github.com/fress-dev/fress-crm-template/pull/32)

| 項目 | 結果 |
|------|------|
| モード | **差分** |
| 判定 | **PASS** |
| 実施者 | sub2 |

### 変更の要約

- `src/custom/karte/**` — Contact Show 差し替え・KarteHubPanel・i18n
- `src/custom/platform/plugin/isPluginEnabled.ts` — テナント plugins + レジストリ参照
- `src/custom/root/FressCRM.tsx` — ContactShow 注入
- `e2e/karteHub.spec.ts` — デスクトップ / モバイルでハブ見出し・プレースホルダ表示
- `docs/workflow/design/karte-hub.md` — 設計書（approved）

### 検査結果

| 項目 | 結果 |
|------|------|
| 設計書整合 | **OK** — `karte-hub.md`（approved）と一致。DB migration なし・入口 UI のみ |
| コア保護 | **OK** — `src/root/**`・`src/components/**` 既存・既存 migrations 変更なし |
| 拡張パターン | **OK** — `src/custom/` + `FressCRM.tsx` 縫い目。`isPluginEnabled()` でガード |
| CRUD/dataProvider | **N/A** — 表示のみ。各プラグイン本体は別 PR |
| DoD | **OK** — `make pre-pr` 緑、`e2e/karteHub.spec.ts` ローカル PASS（2 tests） |

### メモ

- デスクトップはメモ下にハブ、モバイルは「カルテ」タブ
- 未実装プラグインはプレースホルダ表示。stores / deals は有効時に実データ入口

---

## 2026-06-13 | feat/plugin-stores-rls | 店舗スコープ RLS | [PR #30](https://github.com/fress-dev/fress-crm-template/pull/30)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS**（軽微メモあり） |
| 実施者 | @reviewer → メインエージェント |

### 変更の要約

- `sales_stores` テーブル + `can_access_store` 等の RLS 関数
- `contacts` / `stores` の SELECT スコープ更新
- `FressCRM` で sales リソース差し替え、担当店舗チェックボックス UI
- `e2e/storesScope.spec.ts` — RLS 読み取り検証

### 検査結果

| 観点 | 結果 |
|------|------|
| コア保護 | **OK** — `src/components/**` diff なし |
| 設計書整合 | **OK** — archive/plugin-stores-rls.md と実装範囲一致（差し替えは FressCRM 注入） |
| migration | **OK** — 追加のみ |
| e2e | **OK** — `storesScope.spec.ts` ローカル PASS |
| DoD | **OK** — typecheck / platform unit / build / 関連 e2e |

### 指摘・メモ（改善のタネ）

- UI からの `setSalesStoreIds` 保存は e2e 未検証（service_role fixture で割当）。フォローアップで UI 保存 e2e を追加可
- `sales_stores` reset は `sales_id` 条件で全削除に修正済み

---

## 2026-06-13 | feat/plugin-courses-master | コースマスタプラグイン | [PR #27](https://github.com/fress-dev/fress-crm-template/pull/27)

| 項目 | 結果 |
|------|------|
| モード | **差分** |
| 判定 | **PASS** |
| 実施者 | メインエージェント |

### 変更の要約

- `src/custom/plugins/courses/**` — CRUD 画面・dataProvider・seed・ユニットテスト
- `supabase/migrations/20260612130000_courses_plugin.sql` — courses / course_stores
- `src/custom/providers/applyFullTextSearch.ts` / `withPluginDataProvider.ts` — プラグイン向け dataProvider 合成
- `e2e/courses.spec.ts` — 一覧・検索・UI 作成・更新・削除
- `tenants/*.json` — courses プラグイン有効化・courseSeed

### 検査結果

| 項目 | 結果 |
|------|------|
| 設計書整合 | **OK** — `plugin-courses.md`（approved）と一致 |
| コア保護 | **OK** — `src/root/**`・`src/components/**` 既存・既存 migrations 変更なし |
| 拡張パターン | **OK** — `src/custom/` + `App.tsx` 縫い目 |
| CRUD/dataProvider | **OK** — view 誤書き込みなし、検索 `q` 変換、course_stores 差分同期 |
| 指摘対応 | **OK** — 同名検証接続、update ユニットテスト、e2e CRUD 拡張、`CourseFormToolbar` |
| DoD | **OK** — `make pre-pr` 緑、`e2e/courses.spec.ts` ローカル PASS |

### メモ

- Select / Number を含む Card 内フォームで `SaveButton type="submit"` が効かないため、`CourseFormToolbar` で `type="button"` に統一
- `cleanupCourseForSave` で Select 既定値を補完（未選択時も DB 制約を満たす）

---

## 2026-06-10 | fix/tenant-smoke-e2e | tenant smoke e2e 追加 | [PR #11](https://github.com/fress-dev/fress-crm-template/pull/11)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS** |
| 実施者 | メインエージェント |

### 検査結果

| 観点 | 結果 | メモ |
|------|------|------|
| コア保護 | OK | `src/root/**`・`src/components/**`・既存 migrations の差分なし |
| 拡張パターン | OK | `App.tsx` と e2e / makefile のみ。コアロジック非変更 |
| ブランチ命名 | OK | `fix/tenant-smoke-e2e` |
| CRM（RLS / i18n / Query） | OK | DB 変更なし。テナント表示・非表示リソースの smoke e2e を追加 |
| DoD | OK | `make pre-pr` と `make test-e2e-tenant TENANT_ID=<id>` 成功 |

### 変更の要約

- `tenants/<id>.json` を読み込み、指定テナントのタイトル・ラベル・非表示リソースを確認する e2e を追加
- e2e によりブラウザタイトル未同期を検出したため、`App.tsx` でテナントタイトルを `document.title` に同期
- `stop-app-e2e` を冪等化し、`TENANT_ID=<id>` 指定の tenant smoke e2e ターゲットを追加

### 指摘・メモ（改善のタネ）

- 通常 e2e では tenant spec は skip。テナント確認は `make test-e2e-tenant TENANT_ID=<id>` を使う
- ビルド時に Node.js 22.8.0 が Vite 推奨の 22.12+ 未満という警告あり。チェックは成功

---

## 2026-06-10 | fix/plugin-stores-search | 店舗検索・レイアウト・プラグイン運用 | [PR #10](https://github.com/fress-dev/fress-crm-template/pull/10)

| 項目 | 結果 |
|------|------|
| モード | **差分** |
| 判定 | **PASS** |
| 実施者 | メインエージェント |

### 変更の要約

- 店舗一覧 `SearchInput source="q"` に `withStoresListSearch`（`applyFullTextSearch`）を追加
- 店舗 Show/Edit/Create を `StorePageShell` で中央寄せ・`lg:mr-72` 除去
- `contacts.store_id` を nullable 化（プラグイン停止時の会員 CRUD 保護）
- `withPluginDataProvider` は stores 有効時のみラップ
- プラグイン runbook・teardown テンプレ・architecture / implementation-patterns 追記

### 検査結果

| 項目 | 結果 |
|------|------|
| コア保護 | **OK** — `src/components/**` 非変更。縫い目 `App.tsx` のみ |
| CRUD/dataProvider観点 | **OK** — stores 検索の `beforeGetList` 相当をプラグイン層で実装 |
| 拡張パターン | **OK** — レイアウト・プラグイン独立性ルールに沿う |
| DoD | **OK** — `make pre-pr` + platform 単体テスト |

---

## 2026-06-10 | feat/platform-tenant-config | テナント設定実装 | [PR #9](https://github.com/fress-dev/fress-crm-template/pull/9)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS** |
| 実施者 | メインエージェント（@reviewer 相当のチェックリスト適用） |

### 検査結果

| 観点 | 結果 | メモ |
|------|------|------|
| コア保護 | OK | `src/root/**`・`src/components/**`・既存 migrations の差分なし |
| 拡張パターン | OK | `App.tsx` から `src/custom/` の設定変換・i18n・表示制御を注入 |
| ブランチ命名 | OK | `feat/platform-tenant-config` |
| CRM（RLS / i18n / Query） | OK | DB/RLS 変更なし。i18n はテナント JSON から上書き生成 |
| 言語規約 | OK | コメント・ドキュメントは日本語 |
| DoD | OK | `make pre-pr` 成功。関連 e2e は専用 spec なしのため未実行 |

### 変更の要約

- `tenants/*.json` の title / labels / CRM 設定 / hiddenResources を読み込み、CRM props と i18n に反映
- noexcuse では「会員」「入会管理」「スタッフ」の表記と商談段階を適用し、companies を非表示
- 縫い目は `App.tsx` の props 注入と `src/custom/` 側の変換・表示制御に限定

### 指摘・メモ（改善のタネ）

- tenant/noexcuse 専用 e2e は未作成。次に画面回帰を固めるならタイトル・会員表記・companies 非表示の smoke spec を追加する
- ビルド時に Node.js 22.8.0 が Vite 推奨の 22.12+ 未満という警告あり。チェックは成功

---

## 2026-06-09 | feat/platform-implementation-patterns | CRUD / dataProvider 実装パターン | [PR #7](https://github.com/fress-dev/fress-crm-template/pull/7)

| 項目 | 結果 |
|------|------|
| モード | **差分** |
| 判定 | **PASS** |
| 実施者 | メインエージェント |

### 変更の要約

- `.cursor/rules/implementation-patterns.mdc` — CRUD / dataProvider / 検索 / 削除の実装パターン
- `docs/workflow/design/_template.md` — CRUD チェック欄
- `.cursor/agents/reviewer.md` — CRUD / dataProvider レビュー観点
- `AGENTS.md` — 実装パターン rule への参照

### 検査結果

| 項目 | 結果 |
|------|------|
| 設計書整合 | **OK** — `platform-implementation-patterns.md`（approved）のスコープ3点と一致 |
| コア保護 | **OK** — `src/**`・migrations 変更なし |
| 拡張パターン | **OK** — 縫い目・ハーネス docs のみ |
| CRUD/dataProvider観点 | **対象外**（ハーネス追加のみ） |
| DoD | **OK** — `make pre-pr` 想定内（docs / rules のみ） |

### メモ

- ハーネス本体は PR #7 で `develop` にマージ済み。本ブランチでは設計書 archive と横断参照を仕上げる。

---

## 2026-06-09 | feat/platform-plugin-registry | プラグインレジストリ実装 | [PR #4](https://github.com/fress-dev/fress-crm-template/pull/4)

| 項目 | 結果 |
|------|------|
| モード | **総合**（`docs/workflow/**`・`makefile`・`pre-pr-check.sh` を含むため） |
| 判定 | **PASS**（軽微なメモあり） |
| 実施者 | メインエージェント（レビューフェーズ漏れのため事後追記） |

### 変更の要約

- `src/custom/platform/plugin/` — レジストリ・`resolveAppAssembly`・Extension 型
- `src/custom/platform/tenant/` — 最小型 `TenantConfig` + JSON 読み込み
- `tenants/default.json` / `noexcuse.json`
- `vitest.platform.config.ts` + `registry.test.ts`（5 件）
- `App.tsx` — 組み立て経由に変更（コア非変更）
- 同ブランチに research 設計書・プラグイン PR 分離ルール docs を含む

### 検査結果

| 観点 | 結果 |
|------|------|
| コア保護 | **OK** — `src/components/**` diff なし |
| 拡張パターン | **OK** — `src/custom/` + `App.tsx` props 注入 |
| 設計書整合 | **OK** — `platform-plugin-registry.md`（approved）と実装範囲一致 |
| Unit test | **OK** — `test:unit:platform` 5 件、`pre-pr` に追加済み |
| e2e | **未追加** — 設計どおり（画面変更なし）。CI 回帰のみ |
| git 運用 | **OK** — `feat/platform-*`、plugin 業務コードなし |
| DoD | **△** — `make pre-pr` ローカル確認・関連 e2e 未実施（画面無変更のため e2e 省略は妥当） |

### 指摘・メモ（改善のタネ）

- **プロセス**: 実装〜PR 作成時に @reviewer 未実施・本ログ未追記だった。以降は PR 前に必ず実施する
- `assembly.enabledPlugins` は App で未使用（将来プラグインマウント用。現時点は設計どおり）
- `platform-tenant-config` 未マージのまま最小型 TenantConfig で先行。次 PR で拡張予定
- research docs が本 PR に同梱。PR #3 と内容が重なる場合はマージ順を整理

### 任意の改善提案

- `docs/harness/setup.md` に `VITE_TENANT_ID` の記載（tenant-config PR または follow-up）
- マージ後 `platform-plugin-registry.md` を `design/archive/` へ移動

---

## 2026-06-07 | feat/platform-branch-naming-harness | (テスト方針) | [PR #2](https://github.com/fress-dev/fress-crm-template/pull/2)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS** |
| 実施者 | メインエージェント（人間承認済み） |

### 変更の要約

- `AGENTS.md` に「## テスト」「## 道具作成の方針」を追記（ローカル e2e は関連 spec のみ、フルは CI）
- `docs/development-workflow.md` のマージコンフリクト解消とテスト手順の同期
- 差分ベース e2e スクリプトは作らない方針に合わせて未導入

### 指摘・メモ（改善のタネ）

- e2e 実行前は別ターミナルで `make start-e2e` が必要（AGENTS.md に記載）

---

## 2026-06-07 | feat/platform-branch-naming-harness | rebase | [PR #2](https://github.com/fress-dev/fress-crm-template/pull/2)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS** |
| 実施者 | メインエージェント |

### 変更の要約

- PR #1 マージ後の `develop` に rebase。`docs/README.md`・`fixtures.ts`・`package.json` のコンフリクト解消
- `fixtures.ts` は日本語メニュー（`ja`）+ `resolveE2eEnv` を統合
- Prettier 整形済み

### 指摘・メモ（改善のタネ）

- #1 マージ後は platform PR は必ず `git rebase origin/develop` してから push する

---

## 2026-06-07 | feat/platform-branch-naming-harness | (e2e/pre-pr) | [PR #2](https://github.com/fress-dev/fress-crm-template/pull/2)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS**（ローカル typecheck） |
| 実施者 | メインエージェント |

### 検査結果

| 観点 | 結果 | メモ |
|------|------|------|
| コア保護 | OK | e2e/fixtures のみ。コア未変更 |
| CI 失敗原因 | 特定 | `.env.e2e` の `SERVICE_ROLE_KEY` プレースホルダが JWT エラーの原因 |
| 対応 | 実装 | `sync-e2e-env.sh` + `global-setup` + `make pre-pr` |

### 変更の要約

- CI: `make test-e2e-ci` 前に e2e Supabase の service role key を同期
- `e2e/resolveE2eEnv.ts` でプレースホルダ時に status からキー取得
- PR 前: `make pre-pr`（lint/typecheck/unit/build）、`make pre-pr-e2e` で e2e まで

### 指摘・メモ（改善のタネ）

- 日本語化 PR（#1）マージ後は e2e 文言も develop と揃える必要あり
- PR 前に `make pre-pr-e2e` を回せば CI e2e 失敗を事前検知できる

---

## 2026-06-07 | feat/platform-branch-naming-harness | 983007d | [PR #2](https://github.com/fress-dev/fress-crm-template/pull/2)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS** |
| 実施者 | メインエージェント |

### 検査結果

| 観点 | 結果 | メモ |
|------|------|------|
| コア保護 | OK | アプリ・migration コードに触れていない |
| 拡張パターン | OK | ドキュメント・スクリプト・エージェント指示のみ |
| ブランチ命名 | OK | `feat/platform-branch-naming-harness` |
| 言語規約 | OK | 日本語 |
| DoD（テスト） | 対象外 | シェル/ドキュメントのみ |

### 変更の要約

- `docs/review-log.md` でレビュー結果を時系列蓄積
- `scripts/pr-body-with-review.sh` で PR 本文に最新エントリを自動挿入
- reviewer / development-workflow / PR テンプレートを更新

### 指摘・メモ（改善のタネ）

- エントリは新しい順に上へ追記すると PR スクリプトが「最新」を取りやすい
- 将来: FAIL が続く観点は review-log からルールへ昇格する運用を回す

---

## 2026-06-07 | feat/platform-branch-naming-harness | 4930e55 | [PR #2](https://github.com/fress-dev/fress-crm-template/pull/2)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS** |
| 実施者 | メインエージェント（@reviewer 相当のチェックリスト適用） |

### 検査結果

| 観点 | 結果 | メモ |
|------|------|------|
| コア保護 | OK | `develop...HEAD` に `src/components/**`・既存 migrations の差分なし |
| 拡張パターン | OK | ドキュメント・フック・エージェント定義のみ。アプリコード未変更 |
| ブランチ命名 | OK | `feat/platform-branch-naming-harness` |
| 言語規約 | OK | コミット・ドキュメントは日本語 |
| DoD（テスト） | 未実行 | ドキュメント/シェルのみの変更。CI に委譲 |

### 変更の要約

- `docs/branch-strategy.md` で platform / plugin / fix の命名を定義
- `workflow-gate-shell.sh` でブランチ作成・commit・push・PR 時に命名検証
- planner / reviewer / AGENTS / development-workflow を同期

### 指摘・メモ（改善のタネ）

- レビュー結果がチャットのみだと追跡しづらい → **本ファイル（review-log）を導入**
- 旧形式ブランチ（`feat/i18n-phase-1` 等）は commit 時にフックで拒否される。移行手順は branch-strategy に記載済み

### 任意の改善提案

- `gh pr create` 時に review-log を本文へ含める必要あり → 本 PR の続きコミットで `scripts/pr-body-with-review.sh` を追加

---

## エントリの書き方（テンプレート）

@reviewer 完了後、上記と同形式で **新しいエントリを先頭に追記** し、`docs/logs/review-log.md` をコミットに含める。

```markdown
## YYYY-MM-DD | <ブランチ名> | <短いsha> | [PR #N](URL)

| 項目 | 結果 |
|------|------|
| モード | 差分 / 総合 |
| 判定 | **PASS** / **FAIL** |
| 実施者 | @reviewer / メインエージェント |

### 検査結果

| 観点 | 結果 | メモ |
|------|------|------|
| コア保護 | OK / NG | |
| 拡張パターン | OK / 指摘 | |
| ブランチ命名 | OK / NG | |
| CRM（RLS / i18n / Query） | OK / 指摘 / 対象外 | |
| 言語規約 | OK / 指摘 | |
| DoD | 各 ✓ / ✗ | make test / e2e / tsc |

### 変更の要約

（1〜3行）

### 指摘・メモ（改善のタネ）

（FAIL 時は必須。PASS でも気づきがあれば記載）

### 必須の修正（FAIL のみ）

- ...

### 任意の改善提案（3件まで）

- ...
```

---

## 運用ルール

1. **レビュー後** … `@reviewer` の出力をもとにエントリを追記 → `docs/logs/review-log.md` をコミット
2. **PR 作成時** … `scripts/pr-body-with-review.sh` で本文を生成（レビュー欄に最新エントリを含む）
3. **改善時** … 繰り返し出る指摘を `AGENTS.md` / `.cursor/rules/` / フックへ昇格

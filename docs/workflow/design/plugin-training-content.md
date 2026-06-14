# 種目マスタ（training-content Phase 1）

> **status:** draft
> **層:** プラグイン
> **ブランチ（予定）:** feat/plugin-training-content-master
> **最終更新:** 2026-06-14
> **ロードマップ対象:** `plugin-training-content`（Phase 1）
> **前提:** `plugin-stores-master` / `plugin-session-log` がマージ済み

## 概要

Salus の種目マスタ（TrainingType / TrainingGroup）に相当する、トレーニング種目をカテゴリ（部位）単位で管理するプラグインを追加する。セッション記録（`plugin-session-log`）に「何の種目を行ったか」を残すための前提マスタを CRM 上で整備する。本設計は **マスタ整備（CRUD）まで** を対象とし、セッション内の実施記録（重量・回数・セット数）の入力は Phase 2（別設計・別 PR）に切り出す。

## 背景・目的

- Salus では `training_type`（部位・カテゴリ）→ `training_group`（種目名）→ `training_content`（セッション内の weight / count / set_count）の 3 段で身体トレーニングを記録する。
- CRM 側は `plugin-session-log` で身体データ（体重・体脂肪等）までは記録できるが、**「どの種目を何キロ・何回やったか」を残す手段がない**。
- セッション行（実施記録）を入れる前に、選択肢となる **種目マスタ** が必要になる。コースマスタ（`plugin-courses`）と同じく、先にマスタを整える縦切り。
- シナリオ B（日常セッション）でトレーナーが実施種目を選べるようにする土台。シナリオ C（マスタ整備）では種目定義そのものの管理に使う。

## スコープ

### やること

- `training_types`（種目カテゴリ＝部位）テーブルを追加する。
- `training_groups`（種目）テーブルを追加する（`training_type_id` で親カテゴリに紐づく）。
- 種目（`training_groups`）の一覧・検索・作成・編集・削除の CRUD 画面を追加する。
- 種目カテゴリ（`training_types`）の一覧・作成・編集・削除を提供する（少数のため簡易 CRUD）。
- `plugin-session-log` を `PluginDefinition.dependsOn` で前提として明示する。
- 初期データ（代表的な部位・種目）を投入できるよう seed を用意する。
- Phase 2（セッション行）から参照できる安定した resource 名と型を用意する。

### やらないこと

- セッション内の実施記録（`training_content`：weight / count / set_count）の入力・保存・集計 → **Phase 2**。
- `plugin-session-log` の Show / Edit への種目入力 UI 追加 → **Phase 2**。
- 身体グラフ・時系列チャート（`plugin-body-graph`）。
- 種目ごとの目標値・メニュー（プログラム）テンプレート。
- 店舗別の種目出し分け（当面は全店舗共通マスタとする）。
- 金額・請求・決済連携。

## 層の割り当て

[architecture/plugin-architecture.md](../../architecture/plugin-architecture.md) に照らして記載。

| 項目 | 層 | 理由 |
|------|-----|------|
| 種目 CRUD 画面 | プラグイン | コア CRM にない業務マスタ |
| `training_types` / `training_groups` テーブル | プラグイン | session-log（Phase 2）から参照される追加ドメイン |
| ナビゲーション追加 | プラグイン | plugin 有効時のみ表示する管理画面 |
| session-log からの参照 | プラグイン間連携 | Phase 2 で `training_content` の選択肢として依存される |

## データ・画面（概要）

**`training_types`**（種目カテゴリ＝部位）: `id`, `name`, `display_order`, `is_active`, `created_at`, `updated_at`。`name` は unique。

**`training_groups`**（種目）: `id`, `training_type_id`（FK → `training_types.id`）, `name`, `description`, `display_order`, `is_active`, `created_at`, `updated_at`。`(training_type_id, name)` の複合 unique を持つ。

| ルート | 画面 |
|--------|------|
| `/training-groups` | 種目一覧 |
| `/training-groups/create` | 種目作成 |
| `/training-groups/:id` | 種目詳細 |
| `/training-groups/:id/edit` | 種目編集 |
| `/training-types` | 種目カテゴリ一覧・CRUD（簡易） |

画面は `src/custom/plugins/trainingContent/**` に追加する。現状のディレクトリ規約に従い、将来の `src/plugins/**` には置かない。

**プラグイン停止時:** `training_types` / `training_groups` のテーブルとデータは残し、ナビゲーション・ルート・dataProvider 拡張・i18n は有効時のみ適用する。コア CRUD には影響させない。

**強制削除時（例外）:** 通常は teardown migration を作らない。完全撤去する場合のみ、別 PR で FK（Phase 2 の `training_content` 参照を含む）を確認した teardown migration を新規追加する。

## CRUD / dataProvider チェック

| 項目 | 内容 |
|------|------|
| 対象リソース | `training-groups`（主）、`training-types`（親カテゴリ） |
| 対象テーブル / view | 読み書き: `training_groups` / `training_types` |
| 主キー | `training_groups.id` / `training_types.id` |
| 一覧 / 検索 / 作成 / 更新 / 削除 | `training-groups` はすべて実装。`training-types` は一覧・作成・編集・削除（検索は任意） |
| 読み取り先 | テーブル |
| 書き込み先 | テーブル |
| `SearchInput source="q"` | 種目一覧で使う。`name`, `description` を対象に `beforeGetList` で `q` を実在カラムの `@ilike` / `@or` 条件へ変換する。`q` を DB カラムとして送らない |
| 削除方式 | Phase 1 は物理削除。種目に Phase 2 の `training_content` 等の関連が付く場合は FK で失敗させ、画面に通知する。`training_types` は紐づく `training_groups` があれば FK で失敗させる |
| 関連データがある場合 | `training_groups` 削除時に Phase 2 の `training_content` 参照があれば DB 側 FK 制約で防ぐ |
| RLS | Phase 1 は認証済みユーザーに select / insert / update / delete を許可する既存マスタ（courses）相当。service_role の delete を許可する補助 migration を session-log と同じ方針で用意する |
| エラー表示 | FK 制約・重複（unique）違反時は `useNotify` で日本語メッセージを表示する |
| レイアウト | Aside なしの狭いマスタとして Show / Edit / Create で共通シェル（`TrainingGroupPageShell` 等）を使い、`mx-auto w-full max-w-2xl` に揃える。`plugin-courses` の `CoursePageShell` を踏襲 |

## テナント設定

`tenants/<顧客>.json` で持つ項目:

- `plugins` に `"training-content"` を追加（`noexcuse.json`）。
- 初期データが必要な場合は `trainingContentSeed`（代表的な部位・種目）を持つ。seed 同期は `plugin-courses` の `CourseSeedSync` / `seedCourses` を踏襲する。

## カスタム層・連携

- 店舗固有の Extension は Phase 1 では不要（全店舗共通マスタ）。
- Phase 2（セッション行）で `plugin-session-log` の Show / Edit に種目選択 UI を縫い目で差し込む。Phase 1 は参照される型（`TrainingGroup`）と resource 名（`training-groups`）を安定させることに責任を持つ。

## コア保護

- [ ] コアパス（`src/components/**` 等）に手を入れない
- [ ] 縫い目（`App.tsx` / `src/custom/` / 新規 migration）で実現する
- [ ] 既存 migration は編集せず、`supabase/migrations/` に新規タイムスタンプ付き migration を追加する（例: `supabase/migrations/2026MMDDHHMMSS_training_content_plugin.sql`、直近 `20260614150000_appointments_room_id.sql` より後）

## テスト方針

- `make pre-pr`（Prettier / lint / typecheck / unit / build）
- ユニットテスト: 種目入力モデルのバリデーション、検索条件変換（`q` → `@or`）、カテゴリ必須・重複チェック
- 関連 e2e spec: `e2e/trainingContent.spec.ts`（一覧・検索の空文字/ヒットあり/なし・作成・更新・削除・カテゴリ紐づけ）。フル e2e は CI

## 未決事項・リスク

- **`training_types` を CRUD にするか seed 固定にするか**: カテゴリ（部位）は数が少なく更新頻度も低い。簡易 CRUD で進める案だが、seed のみでも可。承認時に確定したい。
- **resource 名**: 主リソースを `training-groups`（種目）とする案。Phase 2 の `training_content` と名前が紛らわしい場合は `exercises` 等への変更を検討。
- **店舗別の出し分け**: Phase 1 は全店舗共通。将来 `plugin-stores-rls` 後に店舗別有効化が必要になれば中間テーブル（`training_group_stores`）を別設計で追加。
- **Phase 2 との境界**: セッション行（`training_content`）は本 PR に含めない。Phase 2 着手時に別設計書を新規作成する。

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| | | |

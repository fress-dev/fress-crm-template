# 種目マスタ（training-content Phase 1）

> **status:** approved
> **archived:** 2026-06-14 — PR 作成時に `archive/` へ移動
> **層:** プラグイン
> **ブランチ:** feat/plugin-training-content-master
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
- 種目カテゴリ（`training_types`）の一覧・作成・編集・削除を提供する（少数のため簡易 CRUD、Show なし＝行クリックで編集）。
- 初期データ（代表的な部位・種目）を投入できるよう seed を用意する。
- Phase 2（セッション行）から参照できる安定した resource 名と型を用意する。

### やらないこと

- セッション内の実施記録（`training_content`：weight / count / set_count）の入力・保存・集計 → **Phase 2**。
- `plugin-session-log` の Show / Edit への種目入力 UI 追加 → **Phase 2**。
- 身体グラフ・時系列チャート（`plugin-body-graph`）。
- 店舗別の種目出し分け（当面は全店舗共通マスタとする）。
- 金額・請求・決済連携。

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| 種目 CRUD 画面 | プラグイン | コア CRM にない業務マスタ |
| `training_types` / `training_groups` テーブル | プラグイン | session-log（Phase 2）から参照される追加ドメイン |
| ナビゲーション追加 | プラグイン | plugin 有効時のみ表示する管理画面 |

## データ・画面（概要）

**`training_types`**（種目カテゴリ＝部位）: `id`, `name`(unique), `display_order`, `is_active`, `created_at`, `updated_at`。

**`training_groups`**（種目）: `id`, `training_type_id`（FK → `training_types.id`, `on delete restrict`）, `name`, `description`, `display_order`, `is_active`, `created_at`, `updated_at`。`(training_type_id, lower(trim(name)))` の複合 unique を持つ。

| ルート | 画面 |
|--------|------|
| `/training_groups` | 種目一覧 |
| `/training_groups/create` | 種目作成 |
| `/training_groups/:id` | 種目詳細 |
| `/training_groups/:id/edit` | 種目編集 |
| `/training_types` | 種目カテゴリ一覧・作成・編集（行クリックで編集） |

画面は `src/custom/plugins/trainingContent/**` に追加。

**プラグイン停止時:** テーブル・データは残し、ナビゲーション・ルート・dataProvider 拡張・i18n・seed は有効時のみ適用する。コア CRUD には影響させない。

**強制削除時（例外）:** 通常は teardown migration を作らない。完全撤去時のみ別 PR で FK を確認した teardown migration を新規追加する。

## CRUD / dataProvider チェック

| 項目 | 内容 |
|------|------|
| 対象リソース | `training-groups`（主）、`training-types`（親カテゴリ） |
| 対象テーブル / view | 読み書き: `training_groups` / `training_types` |
| 主キー | `training_groups.id` / `training_types.id` |
| 一覧 / 検索 / 作成 / 更新 / 削除 | `training-groups` はすべて実装。`training-types` は一覧・作成・編集・削除 |
| 読み取り先 / 書き込み先 | テーブル |
| `SearchInput source="q"` | 使う。`training_groups` は `name`/`description`、`training_types` は `name` を `applyFullTextSearch` で `@or @ilike` へ変換 |
| 削除方式 | 物理削除。`training_types` は紐づく `training_groups` があれば `on delete restrict` でブロック |
| RLS | 認証済みユーザーに select / insert / update / delete を許可（courses 相当）。service_role に delete を付与（e2e resetDb 用） |
| レイアウト | Aside なしの狭いマスタ。Show / Edit / Create で共通シェル（`TrainingPageShell`）+ `mx-auto w-full max-w-2xl` |

## テナント設定

- `tenants/default.json` / `tenants/noexcuse.json` の `plugins` に `"training-content"` を追加。
- `noexcuse.json` は `trainingContentSeed`（胸/脚 + 代表種目）で初回データを投入。seed 同期は `TrainingContentSeedSync` / `seedTrainingContentFromTenant`。

## コア保護

- [x] コアパス（`src/components/**` 等）に手を入れない
- [x] 縫い目（`src/custom/` / 新規 migration / tenant JSON）で実現する
- [x] 既存 migration は編集せず、`supabase/migrations/20260615120000_training_content_plugin.sql` を新規追加

## テスト方針

- `make pre-pr`（Prettier / lint / typecheck / unit / build）緑
- ユニットテスト: 入力モデルの整形・検証、検索条件変換、seed のカテゴリ→種目紐づけ
- 関連 e2e spec: `e2e/trainingContent.spec.ts`（一覧・検索ヒット有無・作成・更新・削除）

## 未決事項・リスク（実装時の確定）

- **`dependsOn`**: 当初 `["session-log"]` としていたが、種目マスタは session-log を FK 参照せず単独で成立するためレビューで削除。将来 session-log がセッション行で `training_groups` を参照する段階で、session-log 側に `dependsOn: [..., "training-content"]` を追加する。
- **`training_types` の CRUD**: 簡易 CRUD（Show なし）で確定。
- **resource 名**: 主リソースは `training-groups`（種目）で確定。
- **店舗別の出し分け**: Phase 1 は全店舗共通。将来 `plugin-stores-rls` 後に必要なら中間テーブルを別設計で追加。
- **Phase 2**: セッション行（`training_content`）は別設計書を新規作成する。

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| 2026-06-14 | （ユーザー指示） | 「作った設計に基づいて開発を進めて」で実装を承認 |

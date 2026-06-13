# コースマスタ

> **status:** approved  
> **archived:** 2026-06-13 — PR 作成時に `archive/` へ移動  
> **層:** プラグイン  
> **ブランチ（予定）:** feat/plugin-courses-master  
> **最終更新:** 2026-06-13  
> **ロードマップ対象:** `plugin-courses`  
> **前提:** `plugin-stores-master` がマージ済み

## 概要

Salus のコースマスタ（Course）に相当する、コース種別・時間・提供内容を管理するプラグインを追加する。契約・回数券を扱う `plugin-memberships` の前提マスタとして、トレーニング / ストレッチなどのサービス種別と標準時間を CRM 上で管理できるようにする。

## 背景・目的

- Salus では契約・チケット・予約の前提として Course が参照される
- CRM では memberships 実装前に、契約対象となるコースの選択肢を先に整備する必要がある
- 複数店舗運用では、店舗ごとに提供コースの有効 / 無効が分かれる可能性がある
- シナリオ A（新規入会）では契約候補のコース選択、シナリオ C（マスタ整備）ではコース定義の管理に使う

## スコープ

### やること

- `courses` テーブルを追加する
- コース一覧・詳細・作成・編集・削除の CRUD 画面を追加する
- コース種別、標準時間、提供内容（トレーニング / ストレッチ）を管理する
- 店舗マスタとの依存を `PluginDefinition.dependsOn` で明示する
- 店舗別に提供可否を管理できるよう、`course_stores` 中間テーブルを追加する
- `plugin-memberships` から参照できるマスタとして、安定した resource 名と型を用意する

### やらないこと

- 契約・回数券の発行、消費、残数管理
- 金額・請求・決済連携
- 予約カレンダーや予約枠の作成
- 部屋（Room）や設備の管理
- コース別の複雑な価格改定履歴
- 顧客別の個別契約条件

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| コース CRUD 画面 | プラグイン | コア CRM にない業務マスタ |
| `courses` テーブル | プラグイン | memberships / appointments から参照される追加ドメイン |
| `course_stores` テーブル | プラグイン | 店舗プラグインを前提にした提供店舗の紐づけ |
| ナビゲーション追加 | プラグイン | plugin 有効時のみ表示する管理画面 |
| memberships からの参照 | プラグイン間連携 | `plugin-memberships` の前提マスタとして依存される |

## データ・画面（概要）

**`courses`**: `id`, `name`, `description`, `course_type`, `service_kind`, `duration_minutes`, `is_active`, `display_order`, `created_at`, `updated_at`。

**`course_stores`**: `id`, `course_id`, `store_id`, `created_at`。`course_id`, `store_id` の複合 unique を持つ。

| ルート | 画面 |
|--------|------|
| `/courses` | コース一覧 |
| `/courses/create` | コース作成 |
| `/courses/:id` | コース詳細 |
| `/courses/:id/edit` | コース編集 |

画面は `src/custom/plugins/courses/**` に追加する。現状のディレクトリ規約に従い、将来の `src/plugins/courses/**` には置かない。

**プラグイン停止時:** `courses` / `course_stores` のテーブルとデータは残し、ナビゲーション・ルート・dataProvider 拡張・i18n は有効時のみ適用する。コア CRUD には影響させない。

**強制削除時（例外）:** 通常は teardown migration を作らない。完全撤去する場合のみ、別 PR で FK を確認した teardown migration を新規追加する。

## CRUD / dataProvider チェック

| 項目 | 内容 |
|------|------|
| 対象リソース | `courses` |
| 対象テーブル / view | 読み書き: `courses`。店舗提供可否: `course_stores` |
| 主キー | `courses.id` |
| 一覧 / 検索 / 作成 / 更新 / 削除 | すべて実装する |
| 読み取り先 | テーブル |
| 書き込み先 | テーブル |
| `SearchInput source="q"` | 使う。`name`, `description`, `course_type`, `service_kind` を対象に `q` を実在カラムの検索条件へ変換する |
| 削除方式 | Phase 1 は物理削除。ただし memberships など関連データがある場合は FK で失敗させ、画面に通知する |
| RLS | Phase 1 は認証済みユーザーに select / insert / update / delete を許可する既存マスタ相当 |
| レイアウト | Aside なしの狭いマスタとして Show / Edit / Create で共通シェルを使い、`mx-auto w-full max-w-2xl` に揃える |

## テナント設定

- `plugins` に `"courses"` を追加
- 初期データが必要な場合は `courseSeed` を持つ

## コア保護

- [x] コアパス（`src/components/**` 等）に手を入れない
- [x] 縫い目（`App.tsx` / `src/custom/` / 新規 migration）で実現する
- [x] 既存 migration は編集せず、`supabase/migrations/` に新規タイムスタンプ付き migration を追加する

## テスト方針

- `make pre-pr`
- ユニットテスト: コース入力モデル、検索条件変換、`course_stores` 保存
- 関連 e2e spec: `e2e/courses.spec.ts`

## 未決事項・リスク

- `course_type` の最終選択肢は memberships の契約モデルと合わせて確定する必要がある
- コースに金額を持たせるかは Phase 1 では未採用
- 店舗権限 RLS が未実装の間は、管理画面上のコースマスタは全店舗分が見える前提になる

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| 2026-06-12 | kinu | draft 確認済み。店舗ごとに提供コースを決められる設計で進行 |

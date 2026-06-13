# plugin-memberships — 契約・回数券

> **status:** approved  
> **層:** プラグイン  
> **ブランチ（予定）:** `feat/plugin-memberships-master`  
> **最終更新:** 2026-06-13  
> **前提:** `plugin-courses-master`（PR #27）、`plugin-stores-master` マージ済み

## 概要

Salus の契約（Contract）とチケット（Ticket）に相当する、会員×コースの契約登録と回数券発行を実装する。コースマスタで定義した商品に対し、枚数（回数）を指定して契約を作成すると、利用可能なチケットを自動発行する。金額・決済・セッション記録・予約との紐づけ消費は本 PR の対象外。

## 背景・目的

- シナリオ A（新規入会）では体験後の契約・回数券発行が必要
- シナリオ B（日常セッション）の前提として、会員が保有する回数券を後続の `plugin-session-log` / `plugin-appointments` が参照する
- `plugin-courses` で整備したコースを契約対象として選択できるようにする
- Deal（商談）拡張ではなく **独立テーブル** とし、回数券モデルを明示する（`features.yaml` の feature-split 方針）

## スコープ

### やること

1. **DB:** `memberships`（契約）・`membership_tickets`（回数券）テーブル追加 migration
2. **契約 CRUD:** 一覧・詳細・登録・編集・削除
3. **チケット自動発行:** 契約作成時に `ticket_count` 枚の `available` チケットを生成
4. **会員・コース・店舗連携:** `ReferenceInput` で contacts / courses / stores を選択
5. **契約状態:** `active` / `completed` / `cancelled`
6. **チケット状態:** `available` / `reserved` / `used` / `cancelled`（本 PR では手動変更なし、`available` のみ生成）
7. **一覧フィルタ:** 会員・コース・契約状態
8. **詳細:** 紐づくチケット一覧（番号・状態）を表示
9. **i18n・ナビ・テナント:** `plugins` に `"memberships"` を追加
10. **テスト:** 単体 + e2e + `make pre-pr`

### やらないこと

- 金額・請求・決済
- 予約（appointments）とのチケット予約・消費連携 → 後続 PR
- セッション記録でのチケット消費 → `plugin-session-log`
- Deal パイプラインとの自動連携
- 契約作成後の `ticket_count` 変更・チケット再発行 UI
- 一括インポート

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| `memberships` / `membership_tickets` | プラグイン migration | コアに契約概念なし |
| 契約 CRUD 画面 | プラグイン | 業務機能 |
| courses / contacts / stores 参照 | プラグイン（既存 FK） | 参照のみ |

## データ・画面（概要）

### テーブル: `memberships`

| カラム | 型 | 説明 |
|--------|-----|------|
| id | bigint | PK |
| contact_id | bigint | 会員（必須、FK contacts） |
| course_id | bigint | コース（必須、FK courses） |
| store_id | bigint | 契約店舗（任意、FK stores） |
| ticket_count | integer | 発行枚数（> 0、作成後変更不可） |
| status | text | `active` / `completed` / `cancelled` |
| started_at | date | 契約開始日（任意） |
| ended_at | date | 契約終了日（任意） |
| notes | text | メモ（任意） |
| created_at / updated_at | timestamptz | 監査 |

### テーブル: `membership_tickets`

| カラム | 型 | 説明 |
|--------|-----|------|
| id | bigint | PK |
| membership_id | bigint | 契約 FK（CASCADE 削除） |
| contact_id | bigint | 会員 FK（一覧用非正規化） |
| ticket_number | integer | 契約内連番（1..ticket_count） |
| status | text | `available` / `reserved` / `used` / `cancelled` |
| used_at | timestamptz | 使用日時（任意） |
| created_at | timestamptz | 作成日時 |

**RLS:** 認証済みユーザーに select / insert / update / delete を許可（マスタ相当）。`membership_tickets` の delete は dataProvider 経由の契約削除時のみ。

### Migration ファイル名

`20260613140000_memberships_plugin.sql`

### 画面・ルート

| ルート | コンポーネント | 内容 |
|--------|--------------|------|
| `/memberships` | `MembershipList` | 一覧（フィルタ付き） |
| `/memberships/create` | `MembershipCreate` | 契約登録 |
| `/memberships/:id` | `MembershipShow` | 詳細 + チケット一覧 |
| `/memberships/:id/edit` | `MembershipEdit` | 編集（status / 日付 / メモ） |

**プラグイン停止時:** テーブル・データは残し、ナビ・dataProvider 拡張のみ無効化。

## CRUD / dataProvider チェック

| 項目 | 内容 |
|------|------|
| 対象リソース | `memberships` |
| 対象テーブル | 読み書き: `memberships`。チケット: `membership_tickets`（dataProvider 内部） |
| 主キー | `memberships.id` |
| 一覧 / 検索 / 作成 / 更新 / 削除 | すべて実装 |
| 読み取り先 | テーブル |
| 書き込み先 | テーブル |
| `SearchInput source="q"` | 使わない（ReferenceInput + SelectInput フィルタ） |
| 削除方式 | 物理削除。`used` / `reserved` チケットがある場合は拒否して通知 |
| 作成時 | membership insert 後、`ticket_count` 分の tickets を bulk insert |
| RLS | authenticated に CRUD 許可 |
| レイアウト | Aside なし。Show / Edit / Create で `mx-auto w-full max-w-2xl` 共通シェル |

## テナント設定

- `plugins` に `"memberships"` を追加（`default` / `noexcuse`）
- 追加 seed は Phase 1 では不要

## コア保護

- [x] コアパス非変更
- [x] `src/custom/` + 新規 migration のみ

## テスト方針

- `make pre-pr`
- 単体: `withMembershipsDataProvider`（作成時チケット生成、削除ガード）
- e2e: `e2e/memberships.spec.ts`（一覧・作成・詳細チケット表示・削除）

## 未決事項・リスク

- PR #27（courses）マージ前は本 PR を courses ブランチ上で開発し、マージ後に rebase する
- 予約連携時に `appointment_id` カラム追加を別 migration で行う

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| 2026-06-13 | kinu | ロードマップ次タスクとして着手 |

# plugin-appointments — スケジュール・予約

> **status:** approved  
> **archived:** 2026-06-13 — PR 作成時に `archive/` へ移動  
> **層:** プラグイン  
> **ブランチ（予定）:** `feat/plugin-appointments-master`  
> **最終更新:** 2026-06-13  
> **前提:** `plugin-stores-master`（PR #5 マージ済み）

## 概要

Salus の「スケジュール管理」に相当する予約 CRUD を実装する。会員・スタッフ・店舗に紐づく予約（セッション・カウンセリング等）の登録・一覧・編集・削除を提供し、カレンダー形式で視覚的に確認できる画面を追加する。セッション記録（身体データ・種目・チケット消費）は `plugin-session-log` に委譲するため本 PR の対象外。

## 背景・目的

- Salus の日常業務の中心は `/schedule`（FullCalendar ベースの予約管理）
- 現状の CRM には予約概念がなく、トレーナーが日程を管理できない
- シナリオ A（新規入会）では体験予約 → 初回予約、シナリオ B（日常）では予約確認がスタート地点
- `plugin-courses`（コースマスタ）は並行 WIP だが、予約には直接依存しない（種別は本プラグイン内 i18n で管理）

## スコープ

### やること

1. **DB:** `appointments` テーブル新規追加 migration
2. **DB:** `del_flg` による論理削除（stores パターンに準拠）
3. **予約 CRUD:** 一覧・詳細・登録・編集（削除は論理削除）
4. **一覧:** テーブルリスト（日付降順）。会員・スタッフ・店舗・種別でフィルタ可
5. **カレンダービュー:** 月/週表示（react-big-calendar または FullCalendar lite）。詳細は実装時に選定
6. **種別（type）:** テナント設定 `appointmentTypes` から取得。デフォルト値は `noexcuse.json` に定義
7. **会員連携:** `ReferenceInput reference="contacts"` で会員を選択（必須）
8. **スタッフ連携:** `ReferenceInput reference="sales"` で担当スタッフを選択（必須）
9. **店舗連携:** 有効店舗のみ選択肢に表示（`ACTIVE_STORE_FILTER` 使用）
10. **i18n:** 日本語ラベル・種別名
11. **テスト:** 単体 + e2e + `make pre-pr`

### やらないこと

- **セッション記録**（身体データ・種目・チケット消費）→ `plugin-session-log`
- **一括予約**（曜日・期間繰り返し）→ `plugin-schedule-bulk`
- **部屋（room_id）選択** → `plugin-rooms`（依存未完了）。store_id のみ
- **カレンダー外部同期**（Google Calendar 等）→ 将来
- **会員向けセルフ予約** → 管理者操作のみ

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| `appointments` テーブル | プラグイン migration | コアに予約概念なし |
| 予約 CRUD 画面 | プラグイン | 業務機能 |
| カレンダービュー | プラグイン | 業務機能 |
| `appointmentTypes` 設定 | テナント設定 | `noexcuse.json` で定義 |
| contacts/sales/stores 参照 | プラグイン（既存 FK） | 参照のみ、コア変更なし |

## データ・画面（概要）

### テーブル: `appointments`（新規）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | bigint | PK（GENERATED ALWAYS AS IDENTITY）|
| contact_id | bigint | 会員（`contacts.id` FK、NULL 可: 会員未登録の体験枠） |
| sales_id | bigint | 担当スタッフ（`sales.id` FK、必須）|
| store_id | bigint | 店舗（`stores.id` FK、NULL 可）|
| start_at | timestamptz | 開始日時（必須）|
| end_at | timestamptz | 終了日時（必須）|
| type | text | 種別コード（`'session'` / `'counseling'` / `'trial'` / `'other'`）|
| title | text | タイトル・メモ（任意）|
| del_flg | boolean | 論理削除フラグ（DEFAULT false）|
| created_at | timestamptz | 作成日時（DEFAULT now()）|

**RLS:** 認証済みユーザーは全件参照可。insert/update は authenticated。delete 禁止（論理削除のみ）。

### Migration ファイル名

`20260613120000_appointments_plugin.sql`

内容:
- `appointments` テーブル CREATE
- FK: `contact_id → contacts.id ON DELETE SET NULL`、`sales_id → sales.id`、`store_id → stores.id ON DELETE SET NULL`
- 部分 UNIQUE インデックス（不要 — 同一枠の重複は運用ルールで対応）
- RLS POLICY（select: all authenticated, insert/update: authenticated）

### 画面・ルート

| ルート | コンポーネント | 内容 |
|--------|--------------|------|
| `/appointments` | `AppointmentList` | 一覧（テーブル + カレンダー切り替えタブ）|
| `/appointments/create` | `AppointmentCreate` | 予約登録フォーム |
| `/appointments/:id` | `AppointmentShow` | 詳細表示 |
| `/appointments/:id/edit` | `AppointmentEdit` | 編集フォーム |

### プラグイン停止時

- `appointments` テーブルはそのまま残る（DB 削除しない）
- ヘッダーからタブが消えるのみ

### 強制削除時（例外）

- teardown migration で `appointments` DROP — 本 PR では作成しない

## CRUD / dataProvider チェック

| 項目 | 内容 |
|------|------|
| 対象リソース | `appointments` |
| 対象テーブル | `appointments` |
| 主キー | `id` (bigint) |
| 一覧 | 有効予約のみ（`del_flg = false`）デフォルト。日付降順 |
| 検索 | `SearchInput source="q"` 対象: `title`。フィルタ: 会員・スタッフ・店舗・種別・期間 |
| 作成 | フォームから。`del_flg` は未指定 → DB default false |
| 更新 | フォームから |
| 削除 | 論理削除（`del_flg = true`）。`dataProvider.delete` を UPDATE に差し替え |
| 読み取り先 | テーブル |
| 書き込み先 | テーブル |
| `SearchInput source="q"` | 使う。対象: `title` |
| 削除方式 | 論理削除（stores パターン踏襲）|
| 関連データ | session_log 未実装のため削除制約なし |
| RLS | select: authenticated, insert/update: authenticated |
| エラー表示 | 既存 `notify` パターン |
| レイアウト | `StorePageShell` 相当の `AppointmentPageShell`（`max-w-2xl mx-auto`）。カレンダーは全幅 |

### dataProvider 実装方針

`withAppointmentsDataProvider` を作成（`withStoresDataProvider` 踏襲）:

1. `getList("appointments")` — `filter.del_flg` 未指定時は `{ del_flg: false }` をマージ
2. `delete("appointments", { id })` — `update({ del_flg: true })` に委譲

## テナント設定

`tenants/noexcuse.json` に `appointmentTypes` を追加:

```json
"appointmentTypes": [
  { "id": "session",     "label": "セッション" },
  { "id": "counseling",  "label": "カウンセリング" },
  { "id": "trial",       "label": "体験" },
  { "id": "other",       "label": "その他" }
]
```

## カスタム層・連携

- `plugin-session-log` が実装されたら、`AppointmentShow` から Session 記録へのリンクを追加（Extension ポイント）
- `plugin-rooms` が実装されたら、`AppointmentCreate/Edit` に `room_id` 選択肢を追加

## コア保護

- [ ] コアパス（`src/components/**` 等）に手を入れない
- [ ] 変更は `src/custom/plugins/appointments/**`・`supabase/migrations/` のみ
- [ ] `App.tsx` は `appointmentsPlugin` 追加のみ

## テスト方針

### 単体

| 対象 | 内容 |
|------|------|
| `withAppointmentsDataProvider` | `getList` が `del_flg=false` を付与 |
| `withAppointmentsDataProvider` | `delete` が `update({ del_flg: true })` になる |

### e2e（`e2e/appointments.spec.ts` 新規）

1. 予約を作成 → 一覧に表示される
2. 予約を編集 → 変更が反映される
3. 予約を削除 → 一覧から消える（物理行は残る）
4. 種別・会員でフィルタできる

## 未決事項・リスク

| 項目 | 内容 | 推奨 |
|------|------|------|
| カレンダーライブラリ | react-big-calendar vs FullCalendar OSS | 実装時に react-big-calendar を試す（ライセンス MIT）|
| contact_id 必須化 | 体験枠は会員なしで作れるか | NULL 許容で実装（運用で判断）|
| 重複チェック | 同一スタッフ・同一時間の二重予約 | Phase 1 はチェックなし（UI 警告のみ検討）|
| カレンダーの表示粒度 | 月/週/日 | 最低限 月+週。日は Phase 2 |

## 受け入れ条件

1. 予約を登録・編集・論理削除できる
2. 一覧で会員・スタッフ・種別・期間でフィルタできる
3. カレンダービュー（月 or 週）で予約が表示される
4. 削除済みは一覧に表示されない
5. `make pre-pr` が通る

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| 2026-06-12 | Cowork（承認権限委譲済み） | 設計確認・実装着手承認 |

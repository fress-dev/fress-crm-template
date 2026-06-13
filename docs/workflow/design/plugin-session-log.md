# plugin-session-log — セッション記録

> **status:** draft  
> **層:** プラグイン  
> **ブランチ（予定）:** `feat/plugin-session-log-master`  
> **最終更新:** 2026-06-13  
> **前提:** `plugin-appointments`（[PR #26](https://github.com/fress-dev/fress-crm-template/pull/26) マージ後）、`plugin-memberships`（PR #31 マージ済み）、`plugin-stores` / `plugin-courses`

## 概要

Salus のセッション記録（`/session/{id}/edit`）に相当する、**実施後カルテ** を実装する。予約（`appointments`）に紐づく（または会員・日時のみで独立した）セッション記録を登録し、身体測定値の保存と回数券（`membership_tickets`）の消費までを一画面で行う。種目記録（TrainingContent）と身体グラフは後続プラグインに委譲する。

## 背景・目的

- シナリオ B（日常セッション）の核心: 予約確認 → **実施記録** → チケット消費
- `plugin-appointments` は予約 CRUD のみ。Salus の `sessions` テーブルが担っていた「身体データ + チケット消費」が未実装
- `plugin-memberships` で発行した `available` チケットを、セッション完了時に `used` へ遷移させる必要がある
- カルテハブ（PR #32）や Contact Show からセッション一覧への入口を将来接続する

## スコープ

### やること

1. **DB:** `session_logs` テーブル新規 migration（論理削除 `del_flg`）
2. **予約連携:** `appointment_id`（任意 FK → `appointments.id`）。予約詳細から「セッション記録を作成」で初期値を引き継ぐ
3. **会員・スタッフ・店舗:** `contact_id`（必須）、`sales_id`（必須）、`store_id`（任意）。予約と同様の ReferenceInput
4. **実施日時:** `performed_at`（timestamptz、必須）。デフォルトは予約 `start_at` または現在時刻
5. **身体データ（Salus 準拠・すべて任意）:** 体重・体脂肪・内臓脂肪レベル・血圧・ウエスト・基礎代謝・筋肉量・体年齢・体水分・コメント
6. **チケット消費:** 会員の `available` チケットから1枚選択し、保存時に `membership_tickets.status = 'used'`、`used_at` 設定。`session_logs.membership_ticket_id` に記録
7. **CRUD:** 一覧・詳細・登録・編集（削除は論理削除）
8. **一覧:** 実施日降順。会員・店舗・担当スタッフでフィルタ。`SearchInput source="q"` で会員名・コメントを検索
9. **i18n・ナビ:** `plugins` に `"session-log"`、`resources.session_logs` ラベル
10. **テスト:** dataProvider 単体 + e2e + `make pre-pr`

### やらないこと

- **種目記録**（重量・回数・セット）→ `plugin-training-content`
- **身体グラフ** → `plugin-body-graph`
- **予約 CRUD・カレンダー** → `plugin-appointments`（済み / PR #26）
- **契約・チケット発行** → `plugin-memberships`（済み）
- **チケットの予約状態（`reserved`）** → 予約連携の深化 PR（本 PR では `available` → `used` のみ）
- **BMI 自動計算 UI** → 将来（身体グラフと同時でも可）
- **一括予約** → `plugin-schedule-bulk`

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| `session_logs` テーブル | プラグイン migration | コアにセッション概念なし |
| セッション CRUD 画面 | プラグイン | 業務機能 |
| チケット消費ロジック | プラグイン dataProvider | `membership_tickets` 更新をトランザクション的に合成 |
| appointments / memberships 参照 | プラグイン（既存 FK） | 参照のみ、コア変更なし |

## データ・画面（概要）

### テーブル: `session_logs`（新規）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | bigint | PK（GENERATED ALWAYS AS IDENTITY）|
| appointment_id | bigint | 予約 FK（NULL 可、`appointments.id` ON DELETE SET NULL）|
| contact_id | bigint | 会員（必須、FK `contacts.id`）|
| sales_id | bigint | 担当スタッフ（必須、FK `sales.id`）|
| store_id | bigint | 店舗（NULL 可、FK `stores.id` ON DELETE SET NULL）|
| membership_ticket_id | bigint | 消費チケット（NULL 可、FK `membership_tickets.id` ON DELETE SET NULL）|
| performed_at | timestamptz | 実施日時（必須）|
| weight_kg | numeric(5,2) | 体重 kg |
| body_fat_percent | numeric(4,1) | 体脂肪率 % |
| visceral_fat_level | integer | 内臓脂肪レベル |
| blood_pressure | text | 血圧（例: `120/80`）|
| waist_cm | numeric(5,1) | ウエスト cm |
| basal_metabolism_kcal | integer | 基礎代謝 kcal |
| muscle_mass_kg | numeric(5,2) | 筋肉量 kg |
| body_age | integer | 体年齢 |
| body_water_percent | numeric(4,1) | 体水分 % |
| comment | text | コメント |
| del_flg | boolean | 論理削除（DEFAULT false）|
| created_at | timestamptz | 作成日時 |

**RLS:** 認証済みユーザーは全件参照可（stores RLS 適用後は `can_access_store(store_id)` でスコープ）。insert/update は authenticated。物理 delete 禁止（論理削除のみ）。

**Migration ファイル名:** `20260613160000_session_logs_plugin.sql`

### 画面・ルート

| ルート | コンポーネント | 内容 |
|--------|--------------|------|
| `/session_logs` | `SessionLogList` | 一覧（テーブル）|
| `/session_logs/create` | `SessionLogCreate` | 登録（`?appointment_id=` クエリで予約から初期化可）|
| `/session_logs/:id` | `SessionLogShow` | 詳細（身体データ + 消費チケット表示）|
| `/session_logs/:id/edit` | `SessionLogEdit` | 編集 |

**Appointment Show からの導線（本 PR）:** `AppointmentShow` に「セッション記録を作成」リンク（`session-log` プラグイン有効時のみ）。コア `AppointmentShow` は編集せず、プラグイン側ラッパーまたは Show 内カスタム Aside で追加（縫い目: `resource.ts` の show コンポーネント差し替えは不可のため、`AppointmentShow` 末尾に `CanAccess` + Link を追加する形で `src/custom/plugins/appointments/` 内に実装）。

### プラグイン停止時

- `session_logs` テーブルは残る
- ナビ・予約詳細のリンクが消えるのみ

### 強制削除時（例外）

- teardown migration で `session_logs` DROP — 本 PR では作成しない

## CRUD / dataProvider チェック

| 項目 | 内容 |
|------|------|
| 対象リソース | `session_logs` |
| 対象テーブル / view | テーブル `session_logs` のみ（view なし）|
| 主キー | `id` |
| 一覧 / 検索 / 作成 / 更新 / 削除 | すべてあり（削除は論理削除）|
| 読み取り先 | テーブル |
| 書き込み先 | テーブル |
| `SearchInput source="q"` | **使う**。`beforeGetList` で `q` を除去し、`contacts` の first_name / last_name を `@or` + `@ilike` で検索（appointments パターン）。コメント `comment@ilike` も対象 |
| 削除方式 | 論理削除（`del_flg = true`）。一覧は `del_flg@eq:false` フィルタ |
| 関連データ | チケット消費済みのセッション削除時: チケットを `available` に戻すか → **本 PR では削除時もチケット状態は変更しない**（運用で手修正。フォローアップで revert 可）|
| RLS | select: authenticated（+ store scope）。insert/update: authenticated。delete: 禁止 |
| エラー表示 | チケット未選択・既に used のチケット選択時は `notify` で日本語エラー |
| レイアウト | Aside なし → `SessionLogPageShell`（`mx-auto w-full max-w-2xl`）を Show / Edit / Create で共有 |

### チケット消費（dataProvider）

`create` / `update` 時:

1. `membership_ticket_id` が指定された場合、対象チケットが `contact_id` 一致かつ `status = 'available'` であることを検証
2. `session_logs` insert/update 成功後、`membership_tickets` を `used` + `used_at = performed_at` に更新
3. `update` でチケット ID が変更された場合: 旧チケットを `available` に戻し、新チケットを `used` に（トランザクションは Supabase RPC または Edge Function 不要 — 順序付き2回 update + 失敗時 notify。厳密トランザクションが必要なら **追加 migration で RPC** を検討し、未決事項に記載）

`getList` / `getOne`: 標準 CRUD + `del_flg` フィルタ。

## テナント設定

`tenants/*.json`:

```json
"plugins": [..., "session-log"]
```

身体項目の必須化は **UI バリデーションのみ**（DB NOT NULL は付けない）。

## カスタム層・連携

- **appointments:** Show から create へ deep link
- **memberships:** チケット選択は `ReferenceInput` + フィルタ `contact_id` + `status=available`
- **karte-hub（PR #32）:** 将来 Contact Show にセッション一覧タブを追加（本 PR ではプレースホルダ不要）

## コア保護

- [x] コアパス（`src/components/**` 等）に手を入れない
- [x] 縫い目（`App.tsx` / `src/custom/` / 新規 migration）で実現する

## テスト方針

- `make pre-pr`（lint / typecheck / unit / build）
- `withSessionLogsDataProvider.test.ts` — チケット消費・available 検証・論理削除
- `e2e/sessionLogs.spec.ts` — 会員+店舗+契約（fixture）→ 予約作成 → セッション記録 → チケット used 確認
- `e2e/fixtures.ts` の `TABLES` に `session_logs` を FK 順で追加

## 未決事項・リスク

| 項目 | 案 | 判断 |
|------|-----|------|
| チケット更新の原子性 | Postgres RPC `consume_ticket_for_session` | 実装時に単体テストで競合が出れば RPC を追加 |
| セッション削除時のチケット復元 | 復元しない（v1） | 上記スコープどおり |
| `appointment_id` 必須か | 任意（予約なし体験記録も可） | **任意** |
| 予約 type=session 以外 | カウンセリングも記録可 | 制限しない |
| PR #26 未マージ | 設計承認後、`develop` に appointments マージ済みを確認してから実装ブランチ作成 | **ブロッカー（実装のみ）** |

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| | | draft — 承認後 `approved` に更新してから `feat/plugin-session-log-master` で実装 |

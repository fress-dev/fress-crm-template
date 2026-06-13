# plugin-rooms — 部屋マスタ

> **status:** draft  
> **層:** プラグイン  
> **ブランチ（予定）:** `feat/plugin-rooms-master`（rooms CRUD）、`feat/plugin-appointments-room`（予約連携）  
> **最終更新:** 2026-06-14  
> **前提:** `plugin-stores-master`（PR #5 マージ済み）、`plugin-appointments`（PR #26 レビュー中 — マージ前でも本設計 draft は可）

## 概要

Salus の部屋（Room）に相当する、**店舗配下のルームマスタ**を CRM に追加する。各店舗に複数の部屋（例: ルーム A / B）を登録し、後続の予約（appointments）から `room_id` で参照できるようにする。本設計書 Phase 1 は **rooms CRUD のみ**。予約テーブルへの `room_id` 追加と予約画面 UI は **別 PR** とする（理由は「PR 分割案」参照）。

## 背景・目的

- Salus では `stores ── rooms` の親子関係があり、店舗画面から部屋を管理する（[03-salus-data-model.md](../research/03-salus-data-model.md)）
- [plugin-stores.md](./archive/plugin-stores.md) Phase 1 では rooms をスコープ外とし、「予約設計時に決定」としていた
- [plugin-appointments](../archive/)（PR #26）では `store_id` のみ実装し、**部屋選択（room_id）は明示的に除外**している
- パーソナルジム CRM では同一店舗・同一時間帯に複数ルームへ予約を割り当てる必要があり、rooms マスタが appointments の前提になる
- `features.yaml` の `plugin-rooms` は P2・on-hold。appointments 設計と整合する draft を先に整備する

## スコープ

### Phase 1（本設計書 — rooms CRUD）

1. **DB:** `rooms` テーブル新規 migration
2. **DB:** `del_flg` による論理削除（stores パターンに準拠）
3. **部屋 CRUD:** 一覧・詳細・登録・編集（削除は論理削除）
4. **店舗連携:** `store_id` 必須。一覧・フォームで店舗フィルタ / 選択
5. **店舗名表示:** 一覧・詳細で所属店舗名を表示（`ReferenceField` または join view は実装時に選定）
6. **i18n・ナビ・テナント:** `plugins` に `"rooms"` を追加
7. **テスト:** 単体 + e2e + `make pre-pr`

### Phase 2（別設計書 / 別 PR — appointments 連携）

1. **DB:** `appointments.room_id` nullable FK を **追加 migration** で付与
2. **UI:** `AppointmentCreate` / `AppointmentEdit` に部屋選択（選択中 `store_id` に属する有効 rooms のみ）
3. **UI:** `AppointmentShow` / 一覧・カレンダーに部屋名表示
4. **任意:** 店舗詳細（`StoreShow`）から当該店舗の部屋一覧へのリンク（Salus の「店舗画面から一括更新」に近い導線）

### やらないこと

- 予約カレンダー本体・予約 CRUD（→ `plugin-appointments`）
- 部屋の設備・収容人数・色分け等の拡張属性（Salus にも無し）
- 部屋ごとの空き枠・ダブルブッキング検証（appointments 側の将来検討）
- 店舗 RLS との完全統合（→ `plugin-stores-rls` マージ後の follow-up で rooms RLS を揃える）
- 一括インポート

## PR 分割案（推奨）

| PR | ブランチ | 内容 | 依存 |
|----|----------|------|------|
| **A** | `feat/plugin-rooms-master` | `rooms` テーブル + CRUD + プラグイン登録 | `stores` マージ済み |
| **B** | `feat/plugin-appointments-room` | `appointments.room_id` migration + 予約画面拡張 | PR #26 マージ後 + PR A マージ後 |

**同一 PR にまとめない理由:**

1. PR #26 は `room_id` なしでレビュー中 — スコープを変えずマージを優先する
2. マスタ CRUD（A）だけでも店舗運用者が部屋定義を先行投入できる
3. レビュー単位が小さく、migration・e2e の失敗切り分けが容易
4. [plugin-architecture.md](../../architecture/plugin-architecture.md) の機能単位プラグイン方針に合う（rooms テーブルは rooms プラグインが所有）

**実装順:** PR A → PR #26 マージ → PR B

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| `rooms` テーブル | プラグイン migration | コアに部屋概念なし |
| 部屋 CRUD 画面 | プラグイン | 業務マスタ |
| `store_id` FK | プラグイン（stores 参照） | 店舗配下の従属マスタ |
| `appointments.room_id` | プラグイン（appointments 側 migration） | 予約プラグインが参照する nullable 拡張 |
| テナント seed | テナント設定（任意） | Phase 1 は手動登録で可 |

## データ・画面（概要）

### テーブル: `rooms`（新規）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | bigint | PK（GENERATED ALWAYS AS IDENTITY）|
| store_id | bigint | 所属店舗（`stores.id` FK、**必須**）|
| name | text | 部屋名（例: ルーム A）。同一店舗内で有効名の一意 |
| del_flg | boolean | 論理削除（DEFAULT false）|
| created_at | timestamptz | 作成日時（DEFAULT now()）|
| updated_at | timestamptz | 更新日時（DEFAULT now()）|

**制約・インデックス（案）:**

- `store_id` FK → `stores.id`（ON DELETE RESTRICT — 店舗削除前に部屋を整理）
- 部分 UNIQUE: `(store_id, lower(trim(name))) WHERE NOT del_flg` — 有効部屋のみ店舗内名一意
- `name` NOT BLANK チェック（stores と同様）

**RLS（Phase 1）:** 認証済みユーザーに select / insert / update / delete を許可（courses / stores Phase 1 と同水準）。`plugin-stores-rls` マージ後は rooms も担当店舗スコープに揃える follow-up を別 PR とする。

### Migration ファイル名（案）

`20260614140000_rooms_plugin.sql`

### 画面・ルート（Phase 1）

| ルート | コンポーネント | 内容 |
|--------|--------------|------|
| `/rooms` | `RoomList` | 一覧（店舗フィルタ・検索）|
| `/rooms/create` | `RoomCreate` | 部屋登録 |
| `/rooms/:id` | `RoomShow` | 詳細 |
| `/rooms/:id/edit` | `RoomEdit` | 編集 |

実装配置: `src/custom/plugins/rooms/**`（`StorePageShell` 相当の `RoomPageShell` で Show / Edit / Create を `mx-auto w-full max-w-2xl` に統一）。

### Phase 2: `appointments` への追加（別 PR）

| カラム | 型 | 説明 |
|--------|-----|------|
| room_id | bigint | 部屋（`rooms.id` FK、**NULL 可**）|

- FK: `room_id → rooms.id ON DELETE SET NULL`
- UI: `store_id` 変更時は `room_id` をクリアするか、新 store に属さない room はバリデーションエラー
- 予約一覧フィルタに部屋を追加（任意）

### プラグイン停止時

- `rooms` テーブル・データは残す（DB 削除しない）
- ナビ・dataProvider 拡張のみ無効化
- appointments に `room_id` 列が既にある場合、停止時も列は残り UI から部屋選択が消えるだけ（値は保持）

### 強制削除時（例外）

- teardown migration で `rooms` DROP
- `appointments.room_id` がある場合は先に FK DROP または列 DROP が必要 — teardown 手順を runbook に記載

## CRUD / dataProvider チェック（Phase 1）

| 項目 | 内容 |
|------|------|
| 対象リソース | `rooms` |
| 対象テーブル / view | 読み書き: `rooms` |
| 主キー | `id` |
| 一覧 / 検索 / 作成 / 更新 / 削除 | すべて実装 |
| 読み取り先 | テーブル |
| 書き込み先 | テーブル |
| `SearchInput source="q"` | 使う。対象: `name`。`beforeGetList` で `q` を `@ilike` に変換 |
| 削除方式 | 論理削除（`del_flg = true`）。`dataProvider.delete` を UPDATE に差し替え（stores 踏襲）|
| 関連データ | Phase 1 では appointments 未連携のため削除制約なし。Phase 2 以降、`room_id` 参照がある予約は SET NULL で許容 |
| RLS | Phase 1: authenticated CRUD |
| エラー表示 | 既存 `notify` パターン。店舗内重複名は DB unique + UI メッセージ |
| レイアウト | Aside なし。`RoomPageShell`（`max-w-2xl mx-auto`）を Show / Edit / Create で共有 |

### dataProvider 実装方針

`withRoomsDataProvider`（`withStoresDataProvider` 踏襲）:

1. `getList("rooms")` — `filter.del_flg` 未指定時は `{ del_flg: false }` をマージ
2. `delete("rooms", { id })` — `update({ del_flg: true })` に委譲
3. 店舗フィルタ: `filter.store_id` をそのまま PostgREST に渡す

## テナント設定

- `plugins` に `"rooms"` を追加（`default` / `noexcuse`）
- Phase 1 では **roomSeed 不要**（店舗ごとに管理画面から登録）。将来 noexcuse 向け初期部屋が必要なら `roomSeed` を follow-up で検討

```json
"plugins": ["stores", "appointments", "rooms"]
```

`PluginDefinition.dependsOn: ["stores"]` を明示する。appointments への依存は rooms CRUD 自体には不要（Phase 2 のみ両方必要）。

## カスタム層・連携

| 連携先 | 内容 |
|--------|------|
| `plugin-stores` | `store_id` FK。有効店舗のみ選択肢（`ACTIVE_STORE_FILTER` 再利用）|
| `plugin-appointments` | Phase 2 で `room_id` 選択・表示。PR #26 設計書の「plugin-rooms 実装後に追加」に合致 |
| `plugin-session-log` | 将来、セッション実施場所として room 参照の可能性 — 本 PR では未着手 |
| `plugin-stores-rls` | マージ後、rooms の select を担当店舗に限定する follow-up |

## コア保護

- [x] コアパス（`src/components/**` 等）に手を入れない
- [x] 縫い目（`App.tsx` / `src/custom/` / 新規 migration）で実現する
- [x] 既存 migration は編集せず追加のみ

## テスト方針

### Phase 1

- `make pre-pr`
- 単体: `withRoomsDataProvider`（`del_flg` デフォルトフィルタ、論理削除）
- e2e: `e2e/rooms.spec.ts`（一覧・店舗フィルタ・作成・編集・論理削除・店舗内重複名エラー）

### Phase 2（別 PR）

- e2e: `e2e/appointments.spec.ts` に部屋選択・表示ケースを追加

## 未決事項・リスク

| 項目 | 内容 | 推奨 |
|------|------|------|
| PR 分割 | rooms CRUD と appointments.room_id を同一 PR にするか | **分割（A + B）** — 上記「PR 分割案」|
| 店舗 Show からの部屋管理 | Salus は店舗画面起点 | Phase 1 は独立 `/rooms` CRUD。StoreShow 連携は Phase 2 任意 |
| RLS と stores-rls | rooms が全店舗見える | Phase 1 はマスタ同等。stores-rls 後に follow-up |
| 削除済み部屋の予約 | room_id が残る | SET NULL + 予約画面では「（削除済み部屋）」表示を Phase 2 で検討 |
| PR #26 マージタイミング | room_id 列が無い | Phase 1（rooms CRUD）は **PR #26 と並行開発可**。Phase 2 は #26 マージ後 |

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| | | status: draft — approved まで実装しない |

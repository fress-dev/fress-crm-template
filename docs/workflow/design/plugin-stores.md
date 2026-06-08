# 店舗マスタとスタッフの店舗スコープ

> **status:** draft  
> **層:** プラグイン  
> **ブランチ（予定）:** `feat/plugin-stores-master`  
> **最終更新:** 2026-06-07  
> **前提:** [platform-tenant-config.md](./platform-tenant-config.md)・[platform-plugin-registry.md](./platform-plugin-registry.md) がマージ済み

## 概要

テナント **noexcuse** 内の複数拠点（船橋店・千葉店等）を **店舗マスタ** で管理し、会員・予約・セッション等を店舗に紐づける。Phase 1 はマスタ CRUD と会員の所属店舗。Phase 2 でスタッフごとの閲覧・編集スコープ（店舗権限）を RLS で実装する。

## 背景・目的

- noexcuse は **1事業・複数店舗**（船橋店、千葉店等）。Salus でも `stores` / `users.store_id` が中核
- テナント（noexcuse CRM）と店舗（船橋店）は **別概念** — テナント JSON は事業全体の設定、店舗は DB マスタ
- 会員登録（管理画面・申込）で **在籍店舗** が必須になる
- いずれ **権限によって担当店舗のデータだけ** 見えるようにする（トレーナーは船橋店のみ、等）
- [plugin-architecture.md](../../architecture/plugin-architecture.md) の「機能単位プラグイン」に従い、業界名ではなく `stores` とする（美容でも同じプラグインを再利用可）

## 用語の整理

| 用語 | 例 | 層 |
|------|-----|-----|
| **テナント** | noexcuse（事業・ブランド） | `tenants/noexcuse.json` |
| **店舗** | 船橋店、千葉店 | DB `stores` テーブル |
| **部屋** | 店舗内のルーム（予約用） | DB `rooms`（本プラグイン or 予約プラグインへ委譲） |

```
noexcuse（テナント = 1つの CRM デプロイ）
  ├── 船橋店（store）
  ├── 千葉店（store）
  └── …
```

## スコープ

### Phase 1（本設計書の実装対象）

- `stores` テーブル + 管理画面 CRUD（一覧・登録・編集）
- 会員（Contact）への `store_id` 紐づけ（カスタムフィールド migration）
- 会員一覧の **店舗フィルタ**
- テナント初回セットアップ用 **シード**（`noexcuse.json` の `storeSeed` から船橋店・千葉店を投入）
- プラグインレジストリへの `stores` 登録
- `tenants/noexcuse.json` の `plugins` に `"stores"` を追加

### Phase 2（将来・別設計書）

- スタッフ（sales）と店舗の **多対多**（`sales_stores`）
- ログインユーザーの所属店舗に基づく **RLS**（contacts / 将来 appointments 等）
- 管理者は全店舗、一般スタッフは担当店舗のみ
- ヘッダーまたは UI で **現在の作業店舗** 切り替え（複数店舗担当者向け）

### やらないこと（Phase 1）

- 部屋（`rooms`）— `plugin-appointments` と同時 or 直後で検討
- 店舗権限・RLS（Phase 2）
- 予約カレンダーの店舗切り替え（appointments プラグイン側）
- マルチテナント SaaS（noexcuse 以外の事業を同一 DB に載せる）

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| `stores` テーブル | プラグイン | コアに店舗概念なし |
| Contact.store_id | プラグイン + migration | コア contacts への追加カラム |
| 店舗 CRUD 画面 | プラグイン | 業務機能 |
| シードデータ | テナント設定 | `storeSeed` を JSON で持つ |
| 店舗スコープ RLS | プラグイン（Phase 2） | 認可は DB 層で統一 |

## データ・画面（概要）

### テーブル（新規 migration）

**`stores`**

| カラム | 型 | 説明 |
|--------|-----|------|
| id | bigint | PK |
| name | text | 店舗名（例: 船橋店） |
| area_code | text | エリアコード（Salus 互換・任意） |
| zip | text | 郵便番号 |
| address | text | 住所 |
| build | text | 建物名 |
| created_at | timestamptz | |

**`contacts` への追加**

| カラム | 型 | 説明 |
|--------|-----|------|
| store_id | bigint FK → stores | 在籍店舗（Salus `users.store_id` 相当） |

**Phase 2: `sales_stores`**

| カラム | 型 | 説明 |
|--------|-----|------|
| sales_id | bigint FK | スタッフ |
| store_id | bigint FK | 担当店舗 |

### 画面・ルート（Phase 1）

| ルート | 画面 |
|--------|------|
| `/stores` | 店舗一覧 |
| `/stores/create` | 店舗登録 |
| `/stores/:id` | 店舗詳細・編集 |

会員フォームに **在籍店舗** セレクトを追加（カスタム Contact フォーム差し替え）。

### `tenants/noexcuse.json` への追記（案）

```json
{
  "id": "noexcuse",
  "title": "noexcuse CRM",
  "plugins": ["stores"],
  "storeSeed": [
    { "name": "船橋店" },
    { "name": "千葉店" }
  ]
}
```

初回マイグレーション or セットアップスクリプトで `storeSeed` を `stores` に insert（既存行があればスキップ）。

## テナント設定

| キー | 用途 |
|------|------|
| `storeSeed` | 初回店舗データの投入元（運用開始後は管理画面で編集） |
| `plugins` | `"stores"` を含める |

## カスタム層・連携

- noexcuse 固有の店舗追加ルールがあれば将来 `extensions/noexcuse/stores.ts`
- Phase 1 では不要

## コア保護

- [x] `src/components/**` の既存ファイルを編集しない
- [x] Contact フォームは **差し替え** で `store_id` を表示
- [x] migration は **追加のみ**

## 他プラグインとの関係

| プラグイン | 店舗との関係 |
|-----------|-------------|
| `plugin-appointments` | 予約に `store_id`（+ `room_id`）必須 — stores 先行が望ましい |
| `plugin-memberships` | 契約は会員経由で店舗が間接的に分かる |
| `plugin-session-log` | セッションに `store_id`（Salus 互換） |
| 会員申込フォーム | 希望店舗セレクトに `stores` を参照 |

**推奨実装順:** platform 2本 → **plugin-stores** → plugin-appointments → plugin-memberships

## Phase 2 設計メモ（実装は別 PR）

### 権限モデル（案）

| ロール | 店舗の見え方 |
|--------|-------------|
| 管理者（sales.administrator） | 全店舗 |
| 一般スタッフ | `sales_stores` に登録された店舗のみ |

### RLS の方針（案）

- `contacts`: `store_id IN (ユーザーの担当店舗)`
- 将来 `appointments` / `sessions` も同様
- サービスロール・管理者バイパスは migration で明示

### UI

- 複数店舗担当者はヘッダーに店舗セレクタ（「今どの店舗の業務をしているか」）
- 単一店舗担当者はセレクタ非表示

## テスト方針

- **単体:** シードロジック、store_id バリデーション
- **`make pre-pr`:** 必須
- **e2e:** 店舗 CRUD、会員に店舗を設定してフィルタできること

## 未決事項・リスク

| 項目 | 内容 |
|------|------|
| `rooms` の置き場 | stores に含めるか appointments に含めるか — 予約設計時に決定 |
| 店舗メニューの位置 | ヘッダー新タブ vs 設定配下 — 実装時に UI 確認 |
| プラグイン route マウント | [platform-plugin-registry.md](./platform-plugin-registry.md) の A/B/C 案に依存 |

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| | | |

## 関連

- [platform-tenant-config.md](./platform-tenant-config.md)
- [05-gap-analysis.md](../research/05-gap-analysis.md)
- Salus: `Store`, `users.store_id`

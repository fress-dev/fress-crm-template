# テナント設定の読み込みと noexcuse 向け表示

> **status:** approved
> **層:** コア（platform）  
> **ブランチ（予定）:** `feat/platform-tenant-config`  
> **最終更新:** 2026-06-07

## 概要

顧客（事業）ごとの設定を `tenants/<id>.json` で持ち、起動時に読み込んで CRM の表示名・商談段階・非表示メニューを切り替える。最初の本番テナントとして **noexcuse**（パーソナルジム事業）用 `noexcuse.json` を追加する。アプリタイトルは **「noexcuse CRM」**。

**店舗（船橋店・千葉店等）のマスタ管理・権限は本 PR に含めない** — [plugin-stores.md](./archive/plugin-stores.md) で対応。

## 背景・目的

- 現状は `plainJapaneseDefaults.ts` に B2B 営業向け設定がベタ書きされ、業種差をコード変更なしで切り替えられない
- 初回導入先は **noexcuse**（複数店舗を持つジム事業）。Salus からの移行想定
- [05-gap-analysis.md](../research/05-gap-analysis.md) で確定した用語（会員・入会管理・スタッフ）を画面に反映
- **テナント（noexcuse）≠ 店舗（船橋店）** — テナントは事業単位、店舗はテナント内の拠点（別プラグイン）
- ジムの業務機能（予約・契約・店舗 CRUD）は本 PR に含めない

## 用語

| 用語 | noexcuse での例 | 設定の置き場 |
|------|----------------|-------------|
| **テナント** | noexcuse（事業全体） | `tenants/noexcuse.json` |
| **店舗** | 船橋店、千葉店 | DB `stores`（[plugin-stores.md](./archive/plugin-stores.md)） |

## スコープ

### やること

- テナント設定の **型定義**（`TenantConfig`）
- `tenants/*.json` の読み込み（`VITE_TENANT_ID` で選択、未指定時は `default`）
- `App.tsx` でテナント設定 → `<CRM>` props（`dealStages` 等）へマージ
- テナント別 **i18n 上書き**（`resources.contacts.name` → 「会員」等）
- **カスタム Header / Layout** で `hiddenResources` に応じたメニュー非表示（`companies`）
- 最初の2テナント JSON:
  - `tenants/default.json` … 現行の B2B 平易日本語（後方互換）
  - `tenants/noexcuse.json` … noexcuse 向けラベル・段階・タスク種類・`storeSeed`（シード用）
- 単体テスト（テナント読み込み・マージロジック）
- `docs/harness/setup.md` に `VITE_TENANT_ID` の記載

### やらないこと

- プラグインレジストリ（次 PR: [platform-plugin-registry.md](./archive/platform-plugin-registry.md)）
- **店舗マスタ CRUD・店舗権限**（[plugin-stores.md](./archive/plugin-stores.md)）
- Contact カスタムフィールド（かな・生年月日・`store_id`）
- 会員申込フォーム
- `companies` リソース自体の削除（コアに残る。メニューと i18n のみ非表示）
- DB マイグレーション
- 管理画面の設定 UI からテナント JSON を編集する機能

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| `TenantConfig` 型・読み込み | コア（platform） | 全テナント共通の組み立て |
| `tenants/*.json` | テナント設定 | 事業差は JSON に閉じる |
| i18n 上書き | コア（platform） | テナント JSON から生成 |
| カスタム Header | カスタム層 | コア `Header.tsx` は編集しない |
| noexcuse 向け段階名・ラベル | テナント設定 | `noexcuse.json` の中身 |
| `storeSeed` | テナント設定 | plugin-stores が DB 投入時に参照 |

## データ・画面（概要）

### ファイル構成（現状は `src/custom/`）

```
tenants/
  default.json
  noexcuse.json
src/custom/platform/tenant/
  types.ts
  loadTenantConfig.ts
  toCrmConfiguration.ts
  toI18nOverrides.ts
src/custom/layout/
  TenantHeader.tsx
  TenantLayout.tsx
src/App.tsx
```

### `TenantConfig` 型（案）

```ts
type TenantConfig = {
  id: string;                    // 例: "noexcuse"
  title: string;                 // 例: "noexcuse CRM"
  plugins: string[];             // 例: ["stores"] — 次 PR 以降で有効化
  hiddenResources?: Array<"companies" | "deals" | "contacts" | "sales">;
  crm: {
    dealStages: Array<{ value: string; label: string }>;
    dealCategories?: Array<{ value: string; label: string }>;
    noteStatuses?: Array<{ value: string; label: string; color: string }>;
    taskTypes?: Array<{ value: string; label: string }>;
    currency?: string;
  };
  labels: {
    contacts: string;
    deals: string;
    sales: string;
    companies?: string;
  };
  /** plugin-stores が初回シードに使用。本 PR では型と JSON のみ */
  storeSeed?: Array<{ name: string; area_code?: string }>;
  extensions?: string[];
};
```

### `tenants/noexcuse.json`（案）

| 項目 | 値 |
|------|-----|
| `id` | `noexcuse` |
| `title` | **`noexcuse CRM`** |
| `labels.contacts` | 会員 |
| `labels.deals` | 入会管理 |
| `labels.sales` | スタッフ |
| `hiddenResources` | `["companies"]` |
| `plugins` | `["stores"]`（stores プラグイン有効） |
| `storeSeed` | 船橋店、千葉店（[plugin-stores.md](./archive/plugin-stores.md) で DB 投入） |
| `crm.dealStages` | 下表 |
| `crm.taskTypes` | 体験後連絡 / 更新案内 / 休会フォロー 等 |

**商談段階:**

| value | label |
|-------|-------|
| `applied` | 申込受付 |
| `trial-booked` | 体験予約 |
| `trial-done` | 体験済 |
| `considering` | 検討中 |
| `joined` | 入会 |
| `churned` | 離脱 |

**金額フィールド:** 非表示にはしない（運用で未入力）。将来 PR で対応。

### 環境変数

| 変数 | 意味 | 既定 |
|------|------|------|
| `VITE_TENANT_ID` | 読み込む `tenants/<id>.json` | `default` |

```sh
VITE_TENANT_ID=noexcuse make start
```

### 画面への影響

| 画面 | 変更 |
|------|------|
| ヘッダー（ロゴ横） | タイトル **noexcuse CRM** |
| ヘッダーナビ | `companies` タブ非表示 |
| 担当者一覧・フォーム | i18n で「会員」 |
| 商談カンバン | 入会管理用段階 |
| 利用者メニュー | 「スタッフ」表記 |

## テナント設定

| ファイル | 用途 |
|----------|------|
| `tenants/default.json` | 汎用 B2B |
| `tenants/noexcuse.json` | noexcuse 事業（Salus 移行先） |

## 実装ロードマップ（platform 以降）

```
1. platform-tenant-config   … noexcuse CRM 表示・JSON（本 PR）
2. platform-plugin-registry … プラグイン載せ台
3. plugin-stores            … 船橋店・千葉店マスタ、会員の在籍店舗
4. plugin-stores Phase 2    … スタッフの店舗権限（RLS）
5. plugin-appointments      … 予約（店舗・部屋前提）
```

## カスタム層・連携

- 本 PR では `extensions` は型のみ
- 連携なし

## コア保護

- [x] コアパス（`src/components/**`）に手を入れない
- [x] 縫い目（`App.tsx` / `src/custom/`）で実現する
- [x] `TenantHeader` を custom に新規作成し `layout` prop で差し替え

## テスト方針

- **単体:** `loadTenantConfig`, `toCrmConfiguration`, `toI18nOverrides`
- **`make pre-pr`:** 必須
- **e2e:** 余力があれば `tenant-noexcuse.spec.ts`（タイトル・会員表記・companies 非表示）

### 手動確認手順

1. `VITE_TENANT_ID=default make start` → 従来の B2B 表示
2. `VITE_TENANT_ID=noexcuse make start` → **noexcuse CRM**、「会員」「入会管理」、取引先企業タブなし
3. 商談カンバンに入会用段階が並ぶ

## 未決事項・リスク

| 項目 | 内容 | 提案 |
|------|------|------|
| 商談の金額欄 | ジムでは未使用 | 当面未入力運用 |
| Deal の `company_id` 必須 | コアフォーム要確認 | 別 PR |
| 店舗権限の時期 | Phase 2 | マスタ先行、RLS はデータが溜まってから |
| 本番デプロイ | 1ビルド = 1テナント | noexcuse 本番は `VITE_TENANT_ID=noexcuse` 固定 |

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| | | |

## 関連

- 次 PR: [platform-plugin-registry.md](./archive/platform-plugin-registry.md)
- 店舗: [plugin-stores.md](./archive/plugin-stores.md)
- [05-gap-analysis.md](../research/05-gap-analysis.md)

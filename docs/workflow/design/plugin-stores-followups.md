# 店舗マスタ — フォローアップ（バリデーション・UI 補完）

> **status:** approved  
> **層:** プラグイン  
> **前提:** [plugin-stores.md](./plugin-stores.md) Phase 1（PR #5）マージ済み  
> **最終更新:** 2026-06-09

## 概要

PR #5（`feat/plugin-stores-master`）で Phase 1 の骨格（CRUD・会員紐づけ・フィルタ・シード）を実装したが、**店舗フォームのバリデーション**と **Salus 互換・運用に必要な周辺機能**が未着手。本設計書はフォローアップ PR の分割案と受け入れ条件を定義する。

## 背景（PR #5 時点のギャップ）

### 店舗フォーム（`StoreInputs`）

| フィールド | 現状 | 問題 |
|-----------|------|------|
| `name` | `required()` のみ | 前後空白・重複名・最大長の制御なし |
| `area_code` | 制約なし | 任意文字列をそのまま保存可 |
| `zip` | 制約なし | `wq` 等の不正値を保存可（スクリーンショットで確認） |
| `address` / `build` | 制約なし | 極端に長い文字列の制御なし |

DB 側も `name NOT NULL` のみで、**一意制約・形式 CHECK なし**。

### 会員フォーム（`store_id`）

| 層 | 現状 | 問題 |
|----|------|------|
| UI | `required()` あり（プラグイン有効時） | フォームは必須だが DB は NULL 許容 — 直接 API 投入で回避可 |
| DB | `store_id` nullable | 在籍店舗必須の業務ルールと不整合 |

### 画面・UX

| 項目 | 設計書の記載 | 現状 |
|------|-------------|------|
| `/stores/:id` 詳細 | 店舗詳細・編集 | **Show 画面なし**（一覧行クリック → Edit のみ） |
| 一覧の空状態 | （未記載） | **Empty コンポーネントなし** |
| 店舗削除 | （未記載） | **削除 UI なし**（参照中の会員がある場合の扱いも未定義） |
| モバイルナビ | （未記載） | **ヘッダータブはデスクトップのみ**（`MobileNavigation` に店舗なし） |

### Salus 互換・データモデル

| 項目 | Salus | 現状 |
|------|-------|------|
| 論理削除 | `del_flg` | 未実装（物理削除のみ想定） |
| 店舗配下のルーム | `rooms` | Phase 1 スコープ外（据え置き） |

### テスト

| 種別 | 現状 | 不足 |
|------|------|------|
| e2e | 正常系 CRUD + フィルタ | **バリデーションエラー・重複登録の否定系なし** |
| 単体 | `seedStores` のみ | **店舗バリデーション関数のテストなし** |

---

## フォローアップ PR の分割案

| PR（予定ブランチ） | 内容 | 優先度 |
|-------------------|------|--------|
| `feat/plugin-stores-validation` | フォーム + DB バリデーション（本設計の §1） | **P0** |
| `feat/plugin-stores-ui` | Show・Empty・削除・モバイルタブ（§2） | P1 |
| `feat/plugin-stores-soft-delete` | `del_flg` + 一覧フィルタ（§3） | P2（appointments 前でも可） |

---

## §1 バリデーション・データ整合性（`feat/plugin-stores-validation`）

### スコープ

#### フォーム（`StoreInputs` + `storeModel.ts` 新規）

| フィールド | ルール | エラーメッセージ方針 |
|-----------|--------|---------------------|
| `name` | 必須、trim 後 1 文字以上、最大 50 文字 | 日本語 i18n（`storesPluginI18n`） |
| `name` | テナント内 **重複不可**（大文字小文字・前後空白を正規化して比較） | 「同じ名前の店舗が既にあります」 |
| `zip` | 任意。入力時は `^\d{3}-?\d{4}$`（ハイフン有無両対応） | 郵便番号の形式 |
| `area_code` | 任意。最大 20 文字、英数字と `-` `_` のみ | エリアコードの形式 |
| `address` | 任意。最大 200 文字 | — |
| `build` | 任意。最大 100 文字 | — |

- `Create` / `Edit` 共通で `transform` により **保存前に trim**
- 重複チェックは `dataProvider.getList('stores', { filter: { name } })` または専用 RPC（件数が増えたら後者）

#### DB（新規 migration・追加のみ）

```sql
-- 案: テナント単 DB のためグローバル UNIQUE で足りる（マルチテナント化時は見直し）
ALTER TABLE public.stores ADD CONSTRAINT stores_name_unique UNIQUE (name);

-- 任意: 空文字を防ぐ CHECK（trim はアプリ側でも実施）
ALTER TABLE public.stores ADD CONSTRAINT stores_name_not_blank CHECK (length(trim(name)) > 0);
```

`contacts.store_id` については **別 migration で NOT NULL にするか要判断**:

| 案 | メリット | デメリット |
|----|---------|-----------|
| A. `store_id SET NOT NULL`（既存 NULL 行を先に埋める） | DB で業務ルールを保証 | 既存データ・インポート経路のマイグレーションが必要 |
| B. Phase 1 は UI 必須のまま DB は nullable | 破壊的変更なし | API 直叩きで回避可 |

**推奨:** フォローアップ PR では **A を noexcuse 新規運用前提で実施**（既存 contact に default store を割り当てる data migration を同梱）。

#### 会員（Contact）

- `store_id` 必須は UI + DB の両方で揃える（上記 A）
- 店舗フィルタに **「在籍店舗なし」** トグルを追加（NULL 行の洗い出し用）

### やらないこと（§1）

- `del_flg`（§3 へ）
- Show / 削除 UI（§2 へ）

### テスト

- **単体:** `validateStoreName`, `normalizeStoreName`, zip 形式
- **e2e:** 店舗名空・郵便番号不正で保存できないこと、重複名でエラー表示
- **`make pre-pr`:** 必須

### 受け入れ条件

1. 郵便番号 `wq` のような値では保存ボタン押下後にフィールドエラーが出る
2. 同名店舗を二重登録できない（UI + DB）
3. 会員登録で店舗未選択では保存できない（DB でも NULL 不可）

---

## §2 UI 補完（`feat/plugin-stores-ui`）

### スコープ

- `StoreShow` — 店舗基本情報 + **在籍会員数**（`contacts` filter `store_id`）
- `StoreEmpty` — 一覧 0 件時の案内
- 一覧からの **削除**（`BulkDeleteButton` または行アクション）
  - 在籍会員がいる店舗は削除不可（FK `ON DELETE SET NULL` では会員が浮く — **削除前に会員 0 件を要求**）
- `MobileNavigation` に店舗タブ（`isStoresPluginEnabled` 時のみ）

### やらないこと

- 論理削除（§3）

### テスト

- e2e: 空一覧の表示、Show 遷移、会員がいる店舗の削除拒否

---

## §3 論理削除（`feat/plugin-stores-soft-delete`）— 任意

Salus の `del_flg` 互換。

- `stores.del_flg boolean default false`
- 一覧は `del_flg = false` のみ（管理者は「削除済みを含む」トグル）
- 会員の `store_id` は削除済み店舗を参照し続けてもよいか — **参照は維持、新規選択肢からは除外** を推奨

---

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| 2026-06-09 | ユーザー | §1・§2 実装着手（`feat/plugin-stores-validation`） |

## 関連

- [plugin-stores.md](./plugin-stores.md) — Phase 1 本体
- [03-salus-data-model.md](../research/03-salus-data-model.md) — `stores.del_flg`

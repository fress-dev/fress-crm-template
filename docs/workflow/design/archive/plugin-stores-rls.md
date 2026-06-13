# 店舗マスタ — スタッフの店舗スコープ（Phase 2）

> **status:** approved  
> **層:** プラグイン  
> **ブランチ（予定）:** `feat/plugin-stores-rls`  
> **最終更新:** 2026-06-13  
> **前提:** [archive/plugin-stores.md](./archive/plugin-stores.md) Phase 1 およびフォローアップ PR マージ済み

## 概要

スタッフ（`sales`）ごとに担当店舗を登録し、会員（`contacts`）と店舗マスタ（`stores`）を **RLS** で担当店舗のみ閲覧・編集できるようにする。管理者は従来どおり全店舗を扱う。

## 背景・目的

- noexcuse は複数店舗運用。トレーナーは船橋店のみ、等の **店舗権限** が必要
- Phase 1 で `store_id` と店舗 CRUD は完了。認可は DB 層で統一する
- Salus の `users.store_id`（単一店舗）を、CRM では **多対多**（`sales_stores`）で表現

## スコープ

### やること

- `sales_stores` テーブル（`sales_id` + `store_id`、複合 PK）
- RLS ヘルパー関数（`current_sales_id` / `has_store_restrictions` / `can_access_store`）
- `contacts` の SELECT / INSERT / UPDATE / DELETE ポリシーを店舗スコープに更新
- `stores` の SELECT ポリシーを店舗スコープに更新（担当外店舗は参照不可）
- `sales_stores` は **管理者のみ** CRUD、スタッフは自分の行を SELECT のみ
- 管理者向け UI: スタッフ編集画面で担当店舗をチェックボックス選択（`FressCRM` の sales リソース差し替え）
- dataProvider に `getSalesStoreIds` / `setSalesStoreIds` を追加
- 単体テスト + e2e（担当店舗のみ会員が見えること）

### やらないこと（別 PR）

- ヘッダーの「作業店舗」セレクタ（複数店舗担当者向け UI フィルタ）
- `appointments` / `sessions` / `deals` 等の店舗スコープ RLS
- 部屋（`rooms`）マスタ

## 権限モデル

| ロール | 店舗の見え方 |
|--------|-------------|
| 管理者（`sales.administrator = true`） | 全店舗・全会員 |
| 一般スタッフ（`sales_stores` に1件以上） | 登録された店舗と、その店舗の会員のみ |
| 一般スタッフ（`sales_stores` が0件） | **移行期間:** 全店舗（既存運用を壊さない）。管理者が店舗を割り当てた時点から制限が有効 |

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| `sales_stores` テーブル・RLS | プラグイン migration | コアに店舗権限なし |
| スタッフ編集 UI | プラグイン + vite 差し替え | コア `SalesEdit` を編集しない |
| dataProvider 拡張 | プラグイン | 既存 `withStoresDataProvider` パターン |

## データ（migration 概要）

**`sales_stores`**

| カラム | 型 | 説明 |
|--------|-----|------|
| sales_id | bigint FK → sales | スタッフ |
| store_id | bigint FK → stores | 担当店舗 |

**RLS 関数（SECURITY DEFINER）**

- `current_sales_id()` — `auth.uid()` から `sales.id` を解決
- `has_store_restrictions()` — ログインユーザーに `sales_stores` 行があるか
- `can_access_store(store_id)` — 管理者 / 制限なし / 担当店舗に含まれるか

## 画面

| 場所 | 内容 |
|------|------|
| `/sales/:id` 編集（管理者のみ） | 担当店舗チェックボックス（有効店舗のみ） |
| 会員フォーム | 変更なし（参照可能な店舗だけ RLS で絞られる） |

## コア保護

- [x] `src/components/**` の既存ファイルを編集しない
- [x] `SalesEdit` は `FressCRM` + `salesResource.ts` で差し替え（コア `sales` index は未変更）
- [x] migration は **追加のみ**

## テスト方針

- **単体:** `getSalesStoreIds` / `setSalesStoreIds` の dataProvider ラッパー
- **`make pre-pr`:** 必須
- **e2e:** `e2e/storesScope.spec.ts` — 担当店舗 UI 表示 + RLS（割当は fixture `assignSalesStore`、読み取りは一般スタッフログインで検証）

## 未決事項・リスク

| 項目 | 内容 |
|------|------|
| 移行期間の全店舗フォールバック | `sales_stores` 未設定スタッフは制限なし。運用開始後に管理者が割当 |
| 関連リソース | notes / tasks は contacts 経由の間接参照のみ。本 PR では contacts RLS のみ |

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| 2026-06-13 | ユーザー | 次タスク着手としてチャットで依頼 |

## 関連

- [archive/plugin-stores.md](./archive/plugin-stores.md) — Phase 1 + Phase 2 メモ
- [product/features.yaml](../../product/features.yaml) — `plugin-stores-rls`

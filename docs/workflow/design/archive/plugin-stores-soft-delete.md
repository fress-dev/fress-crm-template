# 店舗マスタ — 論理削除（del_flg）

> **status:** approved  
> **archived:** 2026-06-12 — PR 作成時に `archive/` へ移動  
> **層:** プラグイン  
> **ブランチ（予定）:** `feat/plugin-stores-soft-delete`  
> **最終更新:** 2026-06-12  
> **前提:** [plugin-stores.md](./archive/plugin-stores.md)（PR #5）・[plugin-stores-followups.md](./archive/plugin-stores-followups.md) §1・§2 マージ済み  
> **features.yaml:** `plugin-stores-soft-delete`（P2 / シナリオ C）

## 概要

Salus 互換の **`stores.del_flg`** を導入し、店舗削除を物理削除から論理削除に切り替える。一覧はデフォルトで有効店舗のみ表示し、管理者は「削除済みを含む」トグルで確認できる。在籍会員の `store_id` は削除済み店舗を参照し続け、新規選択肢からのみ除外する。

## 背景・目的

- Salus の `stores` は **`del_flg`** による論理削除（[03-salus-data-model.md](../research/03-salus-data-model.md)）
- PR #5〜#10 で店舗 CRUD・バリデーション・Show / 削除 UI まで実装済みだが、削除は **物理 DELETE**（在籍会員がいる店舗は拒否）
- 閉店・統合など「履歴は残したいが一覧からは外したい」運用に対応する
- [plugin-stores-followups.md](./archive/plugin-stores-followups.md) §3 として P2・任意（appointments 前でも可）

### 現状（本 PR 着手前）

| 項目 | 状態 |
|------|------|
| `stores.del_flg` | なし |
| 削除 | `StoreDeleteButton` → `dataProvider.delete`（物理削除） |
| 在籍会員あり | 削除拒否（`countContactsForStore`） |
| 店舗一覧 | 全行表示（論理削除フィルタなし） |
| 会員の在籍店舗セレクト | 全店舗を選択肢に表示 |
| 店舗名 UNIQUE | `stores_name_lower_unique`（全行対象） |

## スコープ

### やること

1. **DB:** `stores.del_flg boolean NOT NULL DEFAULT false` を追加 migration
2. **DB:** 店舗名 UNIQUE を **有効店舗のみ** の部分インデックスに変更（論理削除後の同名再登録を許可）
3. **削除:** 物理 DELETE → **`del_flg = true` への UPDATE**（論理削除）
4. **削除制約:** 在籍会員の有無による削除拒否を **撤廃**（参照は維持する方針に合わせる）
5. **店舗一覧:** デフォルト `del_flg = false` のみ。管理者向け **「削除済みを含む」** トグル
6. **会員フォーム:** `ReferenceInput reference="stores"` の選択肢から削除済み店舗を除外
7. **会員一覧フィルタ:** 店舗トグル用の `useGetList("stores")` から削除済みを除外
8. **dataProvider:** 一覧デフォルトフィルタ・削除の UPDATE 化・検索との共存（`withStoresListSearch` 拡張 or ラッパー統合）
9. **UI:** 削除済み行の視覚区別（バッジ等）、Show 画面に削除済み表示
10. **バリデーション:** 店舗名重複チェックは **有効店舗（`del_flg = false`）のみ** 対象
11. **i18n:** 論理削除・トグル・削除済みバッジの文言
12. **テスト:** 単体 + e2e + `make pre-pr`

### やらないこと

- **復元 UI**（`del_flg = false` に戻す操作）— 必要になったら別 PR
- **RLS による店舗スコープ** — `plugin-stores-rls`（Phase 2）
- **rooms / appointments 連携** — 予約プラグイン設計時
- **teardown migration** — プラグイン強制削除時のみ（通常 OFF ではカラム残置）
- **削除済み店舗の Edit 禁止以外の特殊フロー** — Show は閲覧可、Edit は削除済みバッジ表示 + 保存は許可（住所修正等の運用余地）。削除ボタンは非表示 or 二重削除防止

## 層の割り当て

[architecture/plugin-architecture.md](../../architecture/plugin-architecture.md) に照らした配置。

| 項目 | 層 | 理由 |
|------|-----|------|
| `stores.del_flg` カラム | プラグイン migration | コアに店舗概念なし |
| 論理削除 dataProvider | プラグイン | `withPluginDataProvider` 経由で stores のみ拡張 |
| 一覧トグル・Show バッジ | プラグイン UI | 業務画面 |
| 会員 `store_id` 選択肢フィルタ | プラグイン | `ContactInputsWithStore` 差し替えの範囲 |
| 管理者判定 | コア（既存） | `identity.administrator`（`sales` テーブル）を参照するのみ |

## データ・画面（概要）

### migration（追加のみ）

**ファイル名（案）:** `20260612120000_stores_soft_delete.sql`

```sql
-- del_flg 追加
alter table public.stores
    add column del_flg boolean not null default false;

-- 有効店舗のみ名前一意（論理削除後の同名再登録を許可）
drop index if exists public.stores_name_lower_unique;

create unique index stores_name_lower_active_unique
    on public.stores (lower(trim(name)))
    where not del_flg;
```

**`plugin.ts` の `migrations` 配列に追記。**

### 型（`types.ts`）

```typescript
export type Store = {
  // ...既存
  del_flg?: boolean;
};
```

### 画面・ルート

| ルート | 変更 |
|--------|------|
| `/stores` | デフォルト有効店舗のみ。管理者トグルで削除済み含む。削除済み行にバッジ |
| `/stores/:id` | 削除済みの場合「削除済み」表示。削除ボタンは有効店舗のみ |
| `/stores/:id/edit` | 削除済みでも編集可（任意・運用修正用）。削除ボタン非表示 |
| 会員 Create / Edit | 在籍店舗セレクトから削除済み除外 |

### プラグイン停止時

- `del_flg` カラムは DB に残る（nullable 化不要 — boolean default あり）
- プラグイン OFF 時は店舗 UI 非表示。コア Contact CRUD は `store_id` カラム参照のまま（既存方針）

### 強制削除時（例外）

- teardown migration で `stores` DROP または `del_flg` DROP — [\_template-teardown.md](./_template-teardown.md) 参照。本 PR では作成しない

## CRUD / dataProvider チェック

| 項目 | 内容 |
|------|------|
| 対象リソース | `stores` |
| 対象テーブル / view | テーブル `stores`（view なし） |
| 主キー | `id` (bigint) |
| 一覧 | あり。デフォルト `del_flg = false`。管理者トグル ON 時はフィルタ解除（全件） |
| 検索 | あり（既存 `SearchInput source="q"`）。`withStoresListSearch` と合成 |
| 作成 | あり。`del_flg` は未指定 → DB default `false` |
| 更新 | あり。`del_flg` の直接 UPDATE は UI から行わない（削除・将来の復元 API のみ） |
| 削除 | **論理削除** — `delete` を `update({ del_flg: true })` に差し替え |
| 読み取り先 | テーブル |
| 書き込み先 | テーブル |
| `SearchInput source="q"` | **使う**（既存）。対象: `name`, `area_code`, `zip`, `address`, `build`。`del_flg` フィルタと AND 合成 |
| 削除方式 | **論理削除**（`del_flg = true`） |
| 関連データがある場合 | 在籍会員がいても削除可。`contacts.store_id` FK は維持。会員 Show / 一覧では削除済み店舗名も Reference 経由で表示 |
| RLS | 変更なし（select / insert / update 既存 policy のまま。物理 delete policy は残置・未使用） |
| エラー表示 | 既存 `notify` パターン。重複名は有効店舗のみ対象 |
| レイアウト | 既存 `StorePageShell`（`max-w-2xl mx-auto`）。Aside なし。Show / Edit / Create 同一シェル |

### dataProvider 実装方針

`withStoresListSearch` を **`withStoresDataProvider`**（名称案）に統合、または同ファイルで以下を担当:

1. **`getList("stores")`**
   - `filter.del_flg` が明示されていない & `include_deleted`（トグル用キー）がない → `{ del_flg: false }` をマージ
   - 一覧トグル ON 時は `filter: { include_deleted: true }` を UI から送り、ラッパー側で除去して全件取得（`del_flg` 条件なし）
   - その後 `applyFullTextSearch` を適用（既存順序を維持）

2. **`delete("stores", { id })`**
   - `dataProvider.update("stores", { id, data: { del_flg: true }, previousData })` に委譲
   - 物理 DELETE は呼ばない

3. **`getOne` / `getMany` / `getManyReference`**
   - フィルタ追加なし（削除済み ID の参照解決・直接 URL アクセスを許可）

### 店舗名重複チェック（`useStoreNameUniqueCheck`）

- `getList` のデフォルトフィルタ（`del_flg = false`）により、削除済み店舗名との衝突はチェック対象外
- 部分 UNIQUE インデックスと二重で担保

### 会員側の stores 参照

| 箇所 | フィルタ |
|------|---------|
| `ContactInputsWithStore` — `ReferenceInput reference="stores"` | `filter={{ del_flg: false }}` |
| `ContactListFilterWithStore` — `useGetList("stores")` | `filter={{ del_flg: false }}` |
| 会員 Show の `ReferenceField` | フィルタなし（既存 FK 表示） |

### 削除 UI（`StoreDeleteButton`）

- `useDeleteController` はそのまま利用可（dataProvider が論理削除に差し替える）
- **`countContactsForStore` による事前拒否を削除**
- 確認ダイアログ文言を「削除（一覧から非表示）」に合わせて i18n 更新
- 既に `del_flg = true` のレコードではボタン非表示

### 一覧トグル（管理者のみ）

- `useGetIdentity()` → `identity.administrator === true` のときのみ `ToggleFilterButton` を表示
- ラベル例: `resources.stores.filters.include_deleted` → 「削除済みを含む」
- `value={{ include_deleted: true }}` — dataProvider ラッパーが解釈
- 削除済み行: `DataTable` に `del_flg` 列 or 行内 `Badge`「削除済み」

## テナント設定

変更なし。`storeSeed` は有効店舗 0 件時のみ投入（既存ロジック。`del_flg = false` の件数で判定）。

## カスタム層・連携

- Phase 1 では不要
- 将来 `plugin-appointments` が `store_id` 参照する際も、選択肢は有効店舗のみとする方針を共有（本 PR では appointments 未着手）

## コア保護

- [x] コアパス（`src/components/**` 等）に手を入れない
- [x] 変更は `src/custom/plugins/stores/**`・`src/custom/providers/withPluginDataProvider.ts`・新規 migration のみ
- [x] migration は追加のみ

## テスト方針

### 単体

| 対象 | 内容 |
|------|------|
| dataProvider ラッパー | デフォルト `getList` が `del_flg=false` を付与 |
| dataProvider ラッパー | `include_deleted` 時は全件 |
| dataProvider ラッパー | `delete` が `update({ del_flg: true })` になる |
| `createStoreNameUniqueCheck` | 削除済み同名は重複とみなさない |

### e2e（`e2e/stores.spec.ts` 拡張）

1. 店舗を削除 → 一覧から消える（物理行は残る）
2. 削除済み店舗を参照する会員の Show で店舗名が表示される
3. 会員 Create で削除済み店舗が選択肢にない
4. （管理者）「削除済みを含む」ON で削除済み店舗が一覧に表示される
5. 論理削除後、同名店舗を新規作成できる

### その他

- **`make pre-pr`:** 必須

## 未決事項・リスク

| 項目 | 内容 | 推奨 |
|------|------|------|
| 復元 UI | 削除済み → 有効に戻す操作 | 本 PR では見送り。DB 上は UPDATE で可能 |
| 削除済み店舗の Edit | 編集を許すか Show のみか | **Edit 許可**（住所修正等）。削除ボタンのみ非表示 |
| 一般ユーザーが削除済み URL を直接開く | Show は表示される | 許容（機密性低）。バッジで状態明示 |
| 部分 UNIQUE と既存データ | migration 時点で del_flg 全 false | 問題なし |
| Export | 削除済み店舗が CSV に含まれるか | 一覧フィルタに追随（デフォルト除外） |

## 受け入れ条件

1. 店舗削除後、一覧（デフォルト）に表示されない
2. 在籍会員がいる店舗も論理削除できる
3. 会員の在籍店舗は削除後も参照・表示される
4. 会員新規登録の店舗セレクトに削除済み店舗が出ない
5. 管理者が「削除済みを含む」で削除済み店舗を一覧確認できる
6. 論理削除した店舗と同名の新店舗を登録できる
7. `make pre-pr` が通る

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| 2026-06-12 | ユーザー | 実装着手 |

## 関連

- [plugin-stores-followups.md](./archive/plugin-stores-followups.md) — §3 論理削除（本設計書で具体化）
- [plugin-stores.md](./archive/plugin-stores.md) — Phase 1 本体
- [03-salus-data-model.md](../research/03-salus-data-model.md) — Salus `stores.del_flg`
- [plugin-runbook.md](../plugin-runbook.md) — 有効化・停止
- [features.yaml](../../product/features.yaml) — `plugin-stores-soft-delete`

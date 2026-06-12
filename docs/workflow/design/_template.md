# <機能名>

> **status:** draft | approved  
> **層:** コア | プラグイン | テナント設定 | カスタム層  
> **ブランチ（予定）:** feat/platform-xxx / feat/plugin-xxx  
> **最終更新:** YYYY-MM-DD

## 概要

1〜3文で何を実現するか。

## 背景・目的

- なぜ必要か
- 誰のどんな業務課題か

## スコープ

### やること

-

### やらないこと

-

## 層の割り当て

[architecture/plugin-architecture.md](../../architecture/plugin-architecture.md) に照らして記載。

| 項目 | 層 | 理由 |
|------|-----|------|
| 例: 予約画面 | プラグイン | コアにない業務機能 |

## データ・画面（概要）

- 主要エンティティ / テーブル（新規 migration があれば概要）
- 画面・ルート（あれば）
- **プラグイン停止時:** コア CRUD への影響（nullable・UI ガード）。通常は DB 削除しない
- **強制削除時（例外）:** teardown migration の要否（DROP の範囲・データ消失）

## CRUD / dataProvider チェック（該当する場合）

| 項目 | 内容 |
|------|------|
| 対象リソース | |
| 対象テーブル / view | |
| 主キー | |
| 一覧 / 検索 / 作成 / 更新 / 削除 | |
| 読み取り先 | テーブル / view |
| 書き込み先 | テーブル |
| `SearchInput source="q"` | 使う / 使わない。使う場合は検索対象カラムと `beforeGetList` 方針 |
| 削除方式 | 物理削除 / 論理削除 / 削除なし |
| 関連データがある場合 | |
| RLS | select / insert / update / delete |
| エラー表示 | |
| レイアウト | Aside の有無、`flex gap-8` / `lg:mr-72` / `max-w-2xl mx-auto` のどれを使うか。Show・Edit・Create で同じシェルか |

## テナント設定

`tenants/<顧客>.json` で持つ項目（あれば）:

-

## カスタム層・連携

- 店舗固有の Extension が必要か
- 外部連携（将来の連携プラグイン候補）

## コア保護

- [ ] コアパス（`src/components/**` 等）に手を入れない
- [ ] 縫い目（`App.tsx` / `src/custom/` / 新規 migration）で実現する

## テスト方針

- `make pre-pr` の範囲
- 関連 e2e spec（あれば）: `e2e/<対象>.spec.ts`

## 未決事項・リスク

-

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| | | |

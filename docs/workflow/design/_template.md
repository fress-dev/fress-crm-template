# <機能名>

> **status:** draft | approved | implemented  
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

# CRUD / dataProvider 実装パターンのハーネス追加

> **status:** approved  
> **archived:** 2026-06-09 — PR #7 でハーネス実装済み、本 PR 作成時に `archive/` へ移動  
> **層:** コア（ハーネス）  
> **ブランチ:** `feat/platform-implementation-patterns`  
> **最終更新:** 2026-06-09

## 概要

マスタ管理・CRUD 画面で検索や削除の基本操作ミスが多発しているため、AI が参照する実装パターンのルールを追加する。アプリ機能は変更せず、設計書テンプレート・Cursor rules・reviewer 観点に CRUD / dataProvider / 検索 / 削除の確認項目を組み込む。

## 背景・目的

- `SearchInput source="q"` に対応する `beforeGetList` がないと、`q` を存在しないカラムとして検索してエラーになる。
- summary view を読むリソースで delete / update を view に投げると、Supabase 側で失敗しやすい。
- `DeleteButton` の配置、query invalidation、RLS、外部キー制約の確認漏れが CRUD 不具合につながる。
- 既存ハーネスはコア保護・ブランチ・レビュー手順に強いが、実装パターンの明文化が不足している。

## スコープ

### やること

- `.cursor/rules/implementation-patterns.mdc` を追加する。
- `docs/workflow/design/_template.md` に CRUD / dataProvider チェック欄を追加する。
- `.cursor/agents/reviewer.md` に CRUD / dataProvider のレビュー観点を追加する。

### やらないこと

- アプリ実装コードの修正。
- `src/**`、`supabase/migrations/**` の変更。
- 既存 CRUD バグの個別修正。

## 層の割り当て

| 項目 | 層 | 理由 |
|------|-----|------|
| 実装パターン rule | コア | 全プラグイン・全 CRUD に効くハーネス |
| 設計書テンプレート | コア | 実装前の確認漏れを防ぐ |
| reviewer 観点 | コア | PR ごとの検査基準 |

## データ・画面（概要）

- DB 変更なし。
- 画面変更なし。

## テナント設定

なし。

## カスタム層・連携

なし。

## コア保護

- [x] `src/components/**` 等のコアパスに手を入れない
- [x] ハーネス設定・docs の追加のみ

## テスト方針

- `make pre-pr` の範囲。
- アプリ画面変更はないため関連 e2e は不要。
- hook / rules の内容は差分レビューで確認する。

## 未決事項・リスク

- 実装パターン rule を厚くしすぎるとメンテ負荷が増えるため、CRUD バグに直結する項目に限定する。

## 承認

| 日付 | 承認者 | 備考 |
|------|--------|------|
| 2026-06-09 | 人間 | Claude / Codex の診断結果を踏まえてハーネス更新を実施 |

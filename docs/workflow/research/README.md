# 調査（research）

> **最終更新:** 2026-06-08  
> **目的:** 既存システムの機能把握と、CRM への移行・表現の要件定義の土台。  
> **次のステップ:** 人間が本フォルダを確認 → コアで足りる機能／プラグイン化する機能の切り分け → `design/` に設計書（draft）

## design との違い

| | `research/`（本フォルダ） | `design/` |
|--|---------------------------|-----------|
| いつ | 移行前・要件定義の調査 | 実装前の承認用設計 |
| 誰が書く | 調査結果の整理（AI 下書き可） | 実装方針の確定（人間承認必須） |
| 承認 | 不要（ただし人間が内容を確認） | `approved` まで実装しない |
| archive | 調査完了後も参照用に残す | 実装完了〜PR 作成時に `design/archive/` へ |

## 一覧（パーソナルジム / Salus → CRM）

| # | ドキュメント | 内容 |
|---|-------------|------|
| 1 | [01-salus-overview.md](./01-salus-overview.md) | Salus プロジェクト概要・スタック・ドメイン |
| 2 | [02-salus-features.md](./02-salus-features.md) | 機能一覧（画面・モジュール・ワークフロー） |
| 3 | [03-salus-data-model.md](./03-salus-data-model.md) | データモデル・エンティティ関係 |
| 4 | [04-crm-capabilities.md](./04-crm-capabilities.md) | 現行 Fress CRM の提供機能 |
| 5 | [05-gap-analysis.md](./05-gap-analysis.md) | 用語の読み替え・マッピング・ギャップ・他業界展開の判断 |

## 調査元

- **Salus:** `/Users/kinu/workspace/salus`（Laravel 8 パーソナルジム管理）
- **CRM:** 本リポジトリ `fress-crm-template`

## 関連

- [product/crm-features.md](../../product/crm-features.md) — コア CRM 機能一覧
- [architecture/plugin-architecture.md](../../architecture/plugin-architecture.md) — プラグイン設計方針
- [design/README.md](../design/README.md) — 設計書フロー

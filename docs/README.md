# Fress CRM — ドキュメント

目的別にフォルダ分けしています。まず [harness/README.md](./harness/README.md) を読むと全体が把握できます。

## フォルダ構成

```
docs/
├── harness/          … AI 駆動ハーネス（設定・運用の把握）
├── workflow/         … 開発手順・ブランチ・機能設計書
├── architecture/     … 技術方針（プラグイン層など）
├── product/          … 製品・利用者向け機能説明
└── logs/             … 運用ログ（レビュー履歴）
```

## 一覧

### harness/ — ハーネス（AI 設定・運用）

| ドキュメント | 内容 |
|-------------|------|
| [harness/README.md](./harness/README.md) | **入口**。何がありどう連携するか |
| [harness/philosophy.md](./harness/philosophy.md) | 開発思想・fork 方針・ハーネスの育て方 |
| [harness/setup.md](./harness/setup.md) | ローカル環境・テンプレート利用 |

### workflow/ — 開発の進め方

| ドキュメント | 内容 |
|-------------|------|
| [workflow/development.md](./workflow/development.md) | 標準フロー（設計書 → 承認 → 開発 → PR） |
| [workflow/branch-strategy.md](./workflow/branch-strategy.md) | ブランチ命名・並行開発 |
| [workflow/design/README.md](./workflow/design/README.md) | 機能設計書（実装前の承認用） |

### architecture/ — 技術方針

| ドキュメント | 内容 |
|-------------|------|
| [architecture/plugin-architecture.md](./architecture/plugin-architecture.md) | コア・プラグイン・テナント設定・カスタム層 |

### product/ — 製品

| ドキュメント | 内容 |
|-------------|------|
| [product/crm-features.md](./product/crm-features.md) | お客様管理の機能一覧 |

### logs/ — ログ

| ドキュメント | 内容 |
|-------------|------|
| [logs/review-log.md](./logs/review-log.md) | @reviewer の検査履歴 |

## リポジトリ外

| パス | 内容 |
|------|------|
| [AGENTS.md](../AGENTS.md) | メインエージェント向けマスター指示 |
| [doc/](../doc/) | 上流 Atomic CRM の公式ドキュメント（英語） |

## 旧パスからの移行

| 旧パス | 新パス |
|--------|--------|
| `harness-overview.md` | `harness/README.md` |
| `ai-development-harness.md` | `harness/` に分割（リダイレクト残存） |
| `development-workflow.md` | `workflow/development.md` |
| `branch-strategy.md` | `workflow/branch-strategy.md` |
| `design/` | `workflow/design/` |
| `plugin-architecture.md` | `architecture/plugin-architecture.md` |
| `crm-features.md` | `product/crm-features.md` |
| `review-log.md` | `logs/review-log.md` |

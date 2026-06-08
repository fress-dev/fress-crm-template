# 開発思想・背景

> fork + 縫い目拡張の理由、スタック上の注意、ハーネスの育て方。

## このリポジトリの位置づけ

| 項目 | 内容 |
|------|------|
| ベース | [marmelab/atomic-crm](https://github.com/marmelab/atomic-crm)（MIT） |
| 目的 | 中小企業・個人事業主向け CRM の **拡張テンプレート** |
| 方針 | 上流コアは変更せず、**縫い目**で拡張 |

## なぜ fork + 縫い目か

- 上流の修正・機能を `upstream` から取り込める
- 自社差分を `src/custom/` と新規 migration に閉じ込められる
- AI がコアを編集する事故を防げる

## AI 駆動の役割分担

人間は **何を作るか・設計承認・マージ** に集中。AI は縫い目内の調査・設計書・実装・検査を担う。

詳細な手順は [workflow/development.md](../workflow/development.md)、設定一覧は [harness/README.md](./README.md)。

## スタック上の注意

- v1.5.0 以降は **shadcn-admin-kit** ベース（古い react-admin 前提は使わない）
- UI: Shadcn UI + Tailwind / データ: TanStack Query / DB: Supabase + Postgres

## ハーネスの育て方

エージェントが同じミスを2回したら、短く具体的なルールを追記する。

| 追記先 | 向いている内容 |
|--------|----------------|
| `AGENTS.md` | 全体方針・DoD |
| `.cursor/rules/*.mdc` | 常時適用のガード |
| `.cursor/agents/*.md` | サブエージェントの検査基準 |

## 関連

- [harness/README.md](./README.md) — ハーネス全体像
- [harness/setup.md](./setup.md) — ローカル環境・テンプレート利用

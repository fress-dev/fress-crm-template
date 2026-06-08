# ハーネス全体像（把握用）

> **最終更新:** 2026-06-07  
> 人間向けの早見表。詳細は各リンク先。

## 何のためか

AI に **コアを壊さず・縫い目内で・小さな PR** で開発させ、人間は **設計承認とマージ** に集中するための仕組み。

---

## 全体の流れ

```mermaid
flowchart LR
  subgraph human [人間]
    H1[依頼]
    H2[設計承認]
    H3[マージ承認]
  end
  subgraph ai [AI]
    A1[設計書 draft]
    A2[実装]
    A3[@reviewer]
    A4[PR]
  end
  subgraph guard [ガード]
    G1[ルール]
    G2[フック]
    G3[CI]
  end
  H1 --> A1 --> H2 --> A2 --> A3 --> A4 --> H3
  G1 -.-> A2
  G2 -.-> A2
  G3 -.-> A4
```

```
依頼 → 設計書(draft) → 【あなたがOK】→ 実装 → レビュー → テスト → PR → 【あなたがマージ】→ 設計書を archive へ
```

---

## ドキュメントの地図

| フォルダ | 何のドキュメントか |
|----------|-------------------|
| **[harness/](./)** | AI ハーネス設定・運用の把握（本フォルダ） |
| **[workflow/](../workflow/)** | 手順・ブランチ・機能設計書 |
| **[architecture/](../architecture/)** | 技術方針（プラグイン層） |
| **[product/](../product/)** | 製品機能一覧 |
| **[logs/](../logs/)** | レビュー履歴 |

| ファイル | 役割 | 誰が読む |
|----------|------|----------|
| [harness/README.md](./README.md) | **本ファイル**。全体把握 | 人間 |
| [AGENTS.md](../../AGENTS.md) | メインエージェントのマスター指示 | AI（常時） |
| [architecture/plugin-architecture.md](../architecture/plugin-architecture.md) | コア・プラグイン・テナント設定・カスタム層 | AI（設計・実装時） |
| [workflow/design/README.md](../workflow/design/README.md) | 設計書フロー・1PR=1設計・アーカイブ | AI・人間 |
| [workflow/branch-strategy.md](../workflow/branch-strategy.md) | ブランチ命名 | AI・人間 |
| [workflow/development.md](../workflow/development.md) | 手順の詳細 | AI・人間 |
| [logs/review-log.md](../logs/review-log.md) | レビュー結果のログ | AI・人間 |
| [product/crm-features.md](../product/crm-features.md) | 現状の CRM 機能 | AI・人間 |
| [harness/philosophy.md](./philosophy.md) | 開発思想・背景 | 人間 |
| [harness/setup.md](./setup.md) | ローカル環境 | 人間 |

---

## エージェント（`.cursor/agents/`）

| エージェント | 役割 | 触る？ |
|-------------|------|--------|
| **メイン** | 設計書・実装・PR | 書く |
| **@reviewer** | 差分検査（既定）/ 総合検査（依頼時） | 読むだけ |
| **@planner** | 大きな依頼の分解案（任意） | 読むだけ |
| **@db-migrator** | 新規 migration のみ（必要時） | 書く |
| **@Explore** | 調査のみ（ビルトイン） | 読むだけ |

サブエージェントは `.cursor/rules` を継承しない → 各 `agents/*.md` にコア保護を直書き。

## ルール・フック・CI

| 種類 | 場所 | 内容 |
|------|------|------|
| ルール | `.cursor/rules/*.mdc` | フロー・コア保護・日本語規約 |
| フック | `.cursor/hooks/workflow-gate-shell.sh` | ブランチ名・main 直コミット禁止 |
| CI | `.github/workflows/check.yml` | lint / test / e2e |
| スクリプト | `scripts/pre-pr-check.sh` 等 | PR 前チェック・PR 本文生成 |

---

## 連携のイメージ

```
AGENTS.md + rules/*.mdc
    ↓
メインエージェント → 設計書(draft) → 人間(OK) → 実装
    ↓
@reviewer → logs/review-log.md → PR → フック + CI → マージ → 設計書 archive
```

---

## レビューの種類

| 種類 | いつ | 誰 |
|------|------|-----|
| **差分レビュー** | 各 PR | @reviewer |
| **総合レビュー** | ハーネス・方針の見直し | @reviewer に「総合レビュー」と依頼 |

---

## 関連

- [docs/README.md](../README.md) — ドキュメント一覧
- [harness/philosophy.md](./philosophy.md) — 思想の詳細

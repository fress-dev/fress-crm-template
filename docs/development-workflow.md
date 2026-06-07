# 標準開発フロー

> 調査 → 計画 → 承認 → 開発 → レビュー → テスト → PR → マージ

フェーズの状態は **git ブランチと PR** で表現する。状態管理ファイルや CLI は使わない。

## ブランチ戦略

| ブランチ | 役割 |
|----------|------|
| `main` | **本番相当**。直接コミット・push しない |
| `develop` | 開発統合。日常の PR マージ先 |
| `feat/platform-<内容>` | ベース・全業界共通 |
| `feat/plugin-realestate-<内容>` | 不動産プラグインのみ |
| `feat/plugin-beauty-<内容>` | 美容プラグインのみ |
| `fix/<内容>` | バグ修正（業界問わず） |

詳細: [branch-strategy.md](./branch-strategy.md)（命名例・並行開発・編集範囲）

```
feat/platform-xxx ──┐
feat/plugin-*-yyy ──┼──PR──► develop ──（リリース時）──► main
fix/zzz ────────────┘
```

`.cursor/hooks/workflow-gate-shell.sh` が上記パターン以外のブランチでの commit / push / PR をブロックします。

## 手順

```sh
# 1. develop を最新にして作業ブランチを作成（プレフィックスを用途に合わせる）
git checkout develop && git pull
git checkout -b feat/platform-your-task-name   # ベース
# git checkout -b feat/plugin-realestate-...   # 不動産
# git checkout -b feat/plugin-beauty-...      # 美容
# git checkout -b fix/...                      # バグ修正

# 2. Cursor で調査・計画（@Explore → @planner）

# 3. 計画承認（人間）— ここで必ず一度止まる

# 4. 実装（メインエージェント / 必要なら @db-migrator）

# 5. レビュー（@reviewer、差分モード）

# 6. テスト
make test && make test-e2e && npx tsc --noEmit

# 6b. （任意）PR 前の一括チェック — コミット時は pre-commit が自動実行
npm run verify

# 7. コミット（件名・本文は日本語）
#    → pre-commit で lint-staged（Prettier + ESLint）+ registry 生成が走る
git commit -m "変更内容を日本語で記載"

# 8. PR 作成（タイトル・本文も日本語、マージ先は develop）
gh pr create --base develop --title "日本語の PR タイトル" --body-file .github/pull_request_template.md

# 9. マージ（人間が PR を確認してマージ）
```

コミット・PR・`src/custom/**` のソースコメントは日本語。詳細は [AGENTS.md](../AGENTS.md) の「## 言語・表記規約」。

## フェーズと担当

| フェーズ | 担当 | 人間の操作 |
|----------|------|------------|
| 調査 | @Explore（ビルトイン） | — |
| 計画 | @planner | — |
| 承認 | — | 計画を確認して OK |
| 開発 | メインエージェント | — |
| レビュー | @reviewer（差分モード） | — |
| テスト | `make test` / `make test-e2e` | — |
| コミット | メインエージェント | —（メッセージは日本語） |
| PR | メインエージェント（`gh pr create`） | —（タイトル・本文は日本語） |
| マージ承認 | — | PR 確認・マージ |

## 自動化（フック）

| フック | 動作 |
|--------|------|
| `beforeShellExecution` | `main` への直接 commit/push をブロック。作業ブランチ名を検証（`feat/platform-*` 等）。`gh pr create` 時に `--base develop` を促す |

フックは `.cursor/hooks.json`。Cursor を再起動すると読み込まれます。

## 関連

- [branch-strategy.md](./branch-strategy.md) — ブランチ命名・並行開発
- [AGENTS.md](../AGENTS.md) — メインエージェント向けマスター指示（末尾の「## 開発フロー」）
- [ai-development-harness.md](./ai-development-harness.md) — ハーネス全体

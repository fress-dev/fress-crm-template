# 標準開発フロー

> 調査 → 計画 → 承認 → 開発 → レビュー → テスト → PR → マージ

## ブランチ戦略

| ブランチ | 役割 |
|----------|------|
| `main` | **本番相当**。直接コミット・push しない |
| `develop` | 開発統合。日常の PR マージ先 |
| `feat/*` | タスク作業用。`workflow.sh start` で自動作成 |

```
feat/xxx ──PR──► develop ──（リリース時）──► main
```

## クイックスタート

```sh
# 0. 初回のみ develop を用意（ローカルに無い場合）
./scripts/workflow.sh ensure-develop

# 1. タスク開始（feat ブランチを切って checkout）
./scripts/workflow.sh start "日本語化 Phase 1"

# 2. Cursor で調査・計画（@researcher → @planner）

# 3. 計画承認（人間）
./scripts/workflow.sh approve plan

# 4. 実装（メインエージェント / @db-migrator）

# 5. レビュー
# @reviewer → ./scripts/workflow.sh record-review PASS

# 6. テスト
make test && make test-e2e && npx tsc --noEmit
./scripts/workflow.sh record-tests pass
./scripts/workflow.sh phase pr

# 7. PR 作成（マージ先は develop）
# @pr-publisher または gh pr create --base develop
./scripts/workflow.sh record-pr https://github.com/fress-dev/.../pull/N

# 8. マージ後（人間）
./scripts/workflow.sh approve merge
```

## フェーズと担当

| フェーズ | 担当 | 人間の操作 |
|----------|------|------------|
| research | `@researcher` | — |
| plan | `@planner` | — |
| approval_plan | — | `approve plan` |
| develop | メインエージェント | — |
| review | `@reviewer` | — |
| test | `make test` 等 | — |
| pr | `@pr-publisher` | — |
| approval_merge | — | PR 確認・マージ |
| done | — | `approve merge` |

## 自動化（フック）

| フック | 動作 |
|--------|------|
| `sessionStart` | 進行中タスクをエージェントへ通知 |
| `beforeShellExecution` | 未レビューの `gh pr create`、早すぎる `main` push をブロック |
| `stop` | 次にやるべきフェーズを follow-up で提案 |

フックは `.cursor/hooks.json`。Cursor を再起動すると読み込まれます。

## 状態ファイル

- 実行時: `.cursor/workflow-state.json`（gitignore 済み）
- 例: `.cursor/workflow-state.json.example`

```sh
./scripts/workflow.sh status
```

## 関連

- [ai-development-harness.md](./ai-development-harness.md) — ハーネス全体
- [`.cursor/skills/development-workflow/SKILL.md`](../.cursor/skills/development-workflow/SKILL.md) — エージェント向け詳細

# 標準開発フロー

> 調査 → 計画 → 承認 → 開発 → レビュー → テスト → PR → マージ

フェーズの状態は **git ブランチと PR** で表現する。状態管理ファイルや CLI は使わない。

## ブランチ戦略

| ブランチ | 役割 |
|----------|------|
| `main` | **本番相当**。直接コミット・push しない |
| `develop` | 開発統合。日常の PR マージ先 |
| `feat/*` | タスク作業用。`develop` から手動で作成 |

```
feat/xxx ──PR──► develop ──（リリース時）──► main
```

## 手順

```sh
# 1. develop を最新にして feat ブランチを作成
git checkout develop && git pull
git checkout -b feat/your-task-name

# 2. Cursor で調査・計画（@Explore → @planner）

# 3. 計画承認（人間）— ここで必ず一度止まる

# 4. 実装（メインエージェント / 必要なら @db-migrator）

# 5. レビュー（@reviewer、差分モード）

# 6. テスト
make test && make test-e2e && npx tsc --noEmit

# 7. PR 作成（マージ先は develop）
gh pr create --base develop

# 8. マージ（人間が PR を確認してマージ）
```

## フェーズと担当

| フェーズ | 担当 | 人間の操作 |
|----------|------|------------|
| 調査 | @Explore（ビルトイン） | — |
| 計画 | @planner | — |
| 承認 | — | 計画を確認して OK |
| 開発 | メインエージェント | — |
| レビュー | @reviewer（差分モード） | — |
| テスト | `make test` / `make test-e2e` | — |
| PR | メインエージェント（`gh pr create`） | — |
| マージ承認 | — | PR 確認・マージ |

## 自動化（フック）

| フック | 動作 |
|--------|------|
| `beforeShellExecution` | `main` への直接 commit/push をブロック。`gh pr create` 時に `--base develop` を促す |

フックは `.cursor/hooks.json`。Cursor を再起動すると読み込まれます。

## 関連

- [AGENTS.md](../AGENTS.md) — メインエージェント向けマスター指示（末尾の「## 開発フロー」）
- [ai-development-harness.md](./ai-development-harness.md) — ハーネス全体

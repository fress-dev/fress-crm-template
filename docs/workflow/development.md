# 標準開発フロー

> 調査 → 設計書 → 承認 → 開発 → レビュー → テスト → PR → マージ

フェーズの状態は **git ブランチと PR** で表現する。状態管理ファイルや CLI は使わない。

## ブランチ戦略

| ブランチ | 役割 |
|----------|------|
| `main` | **本番相当**。直接コミット・push しない |
| `develop` | 開発統合。日常の PR マージ先 |
| `feat/platform-<内容>` | コア |
| `feat/plugin-<機能名>-<内容>` | プラグイン（**優先**） |
| `feat/plugin-realestate-*` / `feat/plugin-beauty-*` | 機能名で切れない業界専用ドメインのみ |
| `fix/<内容>` | バグ修正 |

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
git checkout -b feat/platform-your-task-name      # コア
# git checkout -b feat/plugin-appointments-form  # プラグイン（優先）
# git checkout -b feat/plugin-realestate-...      # 業界専用ドメインのみ
# git checkout -b fix/...                         # バグ修正

# 2. 調査（@Explore）・設計書作成（docs/workflow/design/<機能名>.md、status: draft）

# 3. 設計承認（人間）— 内容確認後 OK。approved になるまで実装しない
#    大きな依頼は AI が分割案を提示 → 1 設計書 = 1 PR

# 4. 実装（メインエージェント / 必要なら @db-migrator）

# 5. レビュー（@reviewer、差分モード）
#    → 結果を docs/logs/review-log.md の先頭に追記してコミット

# 6. PR 前チェック（CI の e2e 以外 — 推奨）
make pre-pr
# 6b. 関連 e2e のみ（別ターミナルで make start-e2e 後）— 詳細は AGENTS.md「## テスト」
# npx playwright test e2e/<対象>.spec.ts
# 6c. e2e フルスイート（CI 同等。重い — 通常はローカルで回さない）
# make pre-pr-e2e
# コミット時は pre-commit で lint-staged（Prettier + ESLint）+ registry 生成が走る

# 7. コミット（件名・本文は日本語。review-log 追記も含める）
git commit -m "変更内容を日本語で記載"

# 8. PR 作成（タイトル・本文も日本語、マージ先は develop）
#    本文には最新のレビューログが含まれる
gh pr create --base develop --title "日本語の PR タイトル" \
  --body "$(./scripts/pr-body-with-review.sh)"

# 9. マージ（人間が PR を確認してマージ）
#    設計書を docs/workflow/design/archive/ へ移動（以降 AI は参照しない）
```

コミット・PR・`src/custom/**` のソースコメントは日本語。詳細は [AGENTS.md](../../AGENTS.md) の「## 言語・表記規約」。

## フェーズと担当

| フェーズ | 担当 | 人間の操作 |
|----------|------|------------|
| 調査 | @Explore（ビルトイン） | — |
| 設計書 | メインエージェント | —（`docs/workflow/design/` に draft） |
| 設計承認 | — | 設計書を確認して OK（`approved` に更新） |
| 開発 | メインエージェント | — |
| レビュー | @reviewer（差分モード） | —（結果を `docs/logs/review-log.md` に追記） |
| テスト | `make pre-pr` + 関連 e2e spec のみ（`AGENTS.md` 参照）。フル e2e は CI | — |
| コミット | メインエージェント | —（メッセージは日本語） |
| PR | メインエージェント（`gh pr create`） | —（`pr-body-with-review.sh` でレビュー欄を含む） |
| マージ承認 | — | PR 確認・マージ |

## 自動化（フック）

| フック | 動作 |
|--------|------|
| `beforeShellExecution` | `main` への直接 commit/push をブロック。作業ブランチ名を検証（`feat/platform-*` 等）。`gh pr create` 時に `--base develop` を促す |

フックは `.cursor/hooks.json`。Cursor を再起動すると読み込まれます。

## 関連

- [design/README.md](./design/README.md) — 機能設計書
- [logs/review-log.md](../logs/review-log.md) — レビューログ
- [branch-strategy.md](./branch-strategy.md) — ブランチ命名
- [harness/README.md](../harness/README.md) — ハーネス全体像
- [AGENTS.md](../../AGENTS.md) — メインエージェント指示

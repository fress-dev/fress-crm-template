---
name: development-workflow
description: >-
  Fress CRM の標準開発フロー（調査→計画→承認→開発→レビュー→テスト→PR→マージ）を
  オーケストレーションする。新機能・日本語化・拡張実装の着手時に必ず従う。
---

# 開発フロー（標準オーケストレーション）

機能開発は **必ず** 次の順序で進める。フェーズを飛ばさない。

## フェーズ一覧

| # | フェーズ | 担当 | 人間承認 |
|---|----------|------|----------|
| 1 | `research` | `@researcher` またはメイン | 不要 |
| 2 | `plan` | `@planner` | 不要 |
| 3 | `approval_plan` | — | **必須** `./scripts/workflow.sh approve plan` |
| 4 | `develop` | メインエージェント（DB は `@db-migrator`） | 不要 |
| 5 | `review` | `@reviewer` | 不要 |
| 6 | `test` | `make test` / `make test-e2e` / `tsc` | 不要 |
| 7 | `pr` | `@pr-publisher` または `gh pr create` | 不要 |
| 8 | `approval_merge` | — | **必須** 人間が PR 確認・マージ |
| 9 | `done` | `./scripts/workflow.sh approve merge` | 必須 |

## ブランチ戦略

| ブランチ | 用途 |
|----------|------|
| `main` | 本番相当（直接作業禁止） |
| `develop` | 開発統合・PR の base |
| `feat/*` | タスクごとの作業ブランチ |

## 開始コマンド

```sh
./scripts/workflow.sh start "タスク名"
# → develop から feat/<slug> を作成して checkout
```

## 各フェーズの完了アクション

### 1. research

```
@researcher （要望）を調査して
./scripts/workflow.sh phase plan
```

### 2. plan

```
@planner （調査結果を踏まえ）計画を立てて
./scripts/workflow.sh phase approval_plan
```

人間に計画を提示し、**承認を待つ**。

### 3. approval_plan → develop

人間が実行:

```sh
./scripts/workflow.sh approve plan
```

### 4. develop

- 変更は `src/custom/` と新規マイグレーションのみ
- 完了後: `./scripts/workflow.sh phase review`

### 5. review

```
@reviewer 今の差分をレビューして
./scripts/workflow.sh record-review PASS   # または FAIL
```

FAIL なら develop に戻って修正。PASS のみ次へ。

### 6. test

```sh
make test
make test-e2e
npx tsc --noEmit
./scripts/workflow.sh record-tests pass
./scripts/workflow.sh phase pr
```

### 7. pr

```
@pr-publisher PR を作成して
# gh pr create --base develop （main ではない）
./scripts/workflow.sh record-pr https://github.com/...
```

### 8. approval_merge → done

人間が PR をレビュー・マージ後:

```sh
./scripts/workflow.sh approve merge
```

## 状態確認

```sh
./scripts/workflow.sh status
```

## フックによる自動化

- **sessionStart** — 進行中タスクをエージェントへ注入
- **beforeShellExecution** — `main` 直 push / 未レビュー PR 作成をブロック
- **stop** — 次フェーズの follow-up を提案

## エージェント早見表

| フェーズ | エージェント |
|----------|-------------|
| research | `researcher` |
| plan | `planner` |
| develop | メイン + `frontend-dev` / `backend-dev` skills |
| review | `reviewer` |
| pr | `pr-publisher` |

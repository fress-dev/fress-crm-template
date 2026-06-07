# レビューログ

> **@reviewer** の検査結果を時系列で蓄積する。  
> 新しいエントリは **この見出しの直後（上から2番目）** に追記する（新しいほど上）。

将来、このログを見てハーネス（ルール・フック・エージェント指示）を改善する。

---

## 2026-06-07 | feat/platform-branch-naming-harness | 983007d | [PR #2](https://github.com/fress-dev/fress-crm-template/pull/2)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS** |
| 実施者 | メインエージェント |

### 検査結果

| 観点 | 結果 | メモ |
|------|------|------|
| コア保護 | OK | アプリ・migration コードに触れていない |
| 拡張パターン | OK | ドキュメント・スクリプト・エージェント指示のみ |
| ブランチ命名 | OK | `feat/platform-branch-naming-harness` |
| 言語規約 | OK | 日本語 |
| DoD（テスト） | 対象外 | シェル/ドキュメントのみ |

### 変更の要約

- `docs/review-log.md` でレビュー結果を時系列蓄積
- `scripts/pr-body-with-review.sh` で PR 本文に最新エントリを自動挿入
- reviewer / development-workflow / PR テンプレートを更新

### 指摘・メモ（改善のタネ）

- エントリは新しい順に上へ追記すると PR スクリプトが「最新」を取りやすい
- 将来: FAIL が続く観点は review-log からルールへ昇格する運用を回す

---

## 2026-06-07 | feat/platform-branch-naming-harness | 4930e55 | [PR #2](https://github.com/fress-dev/fress-crm-template/pull/2)

| 項目 | 結果 |
|------|------|
| モード | 差分 |
| 判定 | **PASS** |
| 実施者 | メインエージェント（@reviewer 相当のチェックリスト適用） |

### 検査結果

| 観点 | 結果 | メモ |
|------|------|------|
| コア保護 | OK | `develop...HEAD` に `src/components/**`・既存 migrations の差分なし |
| 拡張パターン | OK | ドキュメント・フック・エージェント定義のみ。アプリコード未変更 |
| ブランチ命名 | OK | `feat/platform-branch-naming-harness` |
| 言語規約 | OK | コミット・ドキュメントは日本語 |
| DoD（テスト） | 未実行 | ドキュメント/シェルのみの変更。CI に委譲 |

### 変更の要約

- `docs/branch-strategy.md` で platform / plugin / fix の命名を定義
- `workflow-gate-shell.sh` でブランチ作成・commit・push・PR 時に命名検証
- planner / reviewer / AGENTS / development-workflow を同期

### 指摘・メモ（改善のタネ）

- レビュー結果がチャットのみだと追跡しづらい → **本ファイル（review-log）を導入**
- 旧形式ブランチ（`feat/i18n-phase-1` 等）は commit 時にフックで拒否される。移行手順は branch-strategy に記載済み

### 任意の改善提案

- `gh pr create` 時に review-log を本文へ含める必要あり → 本 PR の続きコミットで `scripts/pr-body-with-review.sh` を追加

---

## エントリの書き方（テンプレート）

@reviewer 完了後、上記と同形式で **新しいエントリを先頭に追記** し、`docs/review-log.md` をコミットに含める。

```markdown
## YYYY-MM-DD | <ブランチ名> | <短いsha> | [PR #N](URL)

| 項目 | 結果 |
|------|------|
| モード | 差分 / 総合 |
| 判定 | **PASS** / **FAIL** |
| 実施者 | @reviewer / メインエージェント |

### 検査結果

| 観点 | 結果 | メモ |
|------|------|------|
| コア保護 | OK / NG | |
| 拡張パターン | OK / 指摘 | |
| ブランチ命名 | OK / NG | |
| CRM（RLS / i18n / Query） | OK / 指摘 / 対象外 | |
| 言語規約 | OK / 指摘 | |
| DoD | 各 ✓ / ✗ | make test / e2e / tsc |

### 変更の要約

（1〜3行）

### 指摘・メモ（改善のタネ）

（FAIL 時は必須。PASS でも気づきがあれば記載）

### 必須の修正（FAIL のみ）

- ...

### 任意の改善提案（3件まで）

- ...
```

---

## 運用ルール

1. **レビュー後** … `@reviewer` の出力をもとにエントリを追記 → `docs/review-log.md` をコミット
2. **PR 作成時** … `scripts/pr-body-with-review.sh` で本文を生成（レビュー欄に最新エントリを含む）
3. **改善時** … 繰り返し出る指摘を `AGENTS.md` / `.cursor/rules/` / フックへ昇格

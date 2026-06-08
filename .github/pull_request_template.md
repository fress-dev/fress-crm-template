## 概要

_この PR で何を解決・追加したか（縫い目で実現した理由を含む）_

## コア保護

- [ ] コアパス（`src/root/**`、既存 `src/components/**`、既存 migrations）の diff は空

## テスト

_ローカルは `make pre-pr` + 関連 e2e spec のみ。フル e2e は CI_

- [ ] `make pre-pr`
- [ ] 関連 e2e spec（触った画面）: `npx playwright test e2e/<対象>.spec.ts`
- [ ] `@reviewer` PASS（[docs/logs/review-log.md](../docs/logs/review-log.md) にエントリ追記済み）

## 補足

_レビュアー向けの注意点があれば記載_

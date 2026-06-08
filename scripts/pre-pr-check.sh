#!/usr/bin/env bash
# PR 作成前にローカルで走らせるチェック（CI の e2e 以外と同等）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Prettier"
npm run prettier

echo "==> ESLint"
npm run lint

echo "==> Typecheck"
npm run typecheck

echo "==> Unit tests"
npm run test:unit:platform
npm run test:unit:app

echo "==> Build"
npm run build

echo ""
echo "✅ pre-pr チェック完了（e2e は未実行）。フル確認: make pre-pr-e2e"
echo "   PR 作成: gh pr create --base develop --body \"\$(./scripts/pr-body-with-review.sh)\""

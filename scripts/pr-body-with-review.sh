#!/usr/bin/env bash
# PR 本文テンプレート + docs/review-log.md の最新エントリを結合して stdout に出力する
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="${ROOT}/.github/pull_request_template.md"
REVIEW_LOG="${ROOT}/docs/review-log.md"

if [[ ! -f "$TEMPLATE" ]]; then
  echo "テンプレートが見つかりません: $TEMPLATE" >&2
  exit 1
fi

extract_latest_review_entry() {
  if [[ ! -f "$REVIEW_LOG" ]]; then
    echo "_（review-log 未作成）_"
    return
  fi
  # 先頭から最初の「日付付きエントリ」（## YYYY-MM-DD |）を次の同レベル見出し手前まで抽出
  awk '
    /^## [0-9]{4}-[0-9]{2}-[0-9]{2} \|/ { found=1 }
    found { print }
    found && /^## / && !/^## [0-9]{4}-[0-9]{2}-[0-9]{2} \|/ { exit }
  ' "$REVIEW_LOG"
}

latest="$(extract_latest_review_entry)"
if [[ -z "$latest" ]]; then
  latest="_（review-log にエントリがありません。@reviewer 後に追記してください）_"
fi

cat "$TEMPLATE"
echo ""
echo "## エージェントレビュー"
echo ""
echo "詳細ログ: [docs/review-log.md](../docs/review-log.md)"
echo ""
echo "$latest"

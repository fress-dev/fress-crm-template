#!/usr/bin/env bash
# develop を現在のブランチにマージし、設計書ドキュメントのコンフリクトのみ自動解消する。
# それ以外のコンフリクトは手動対応が必要（exit 1）。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DOC_CONFLICT_PREFIXES=(
  "docs/workflow/design/"
  "docs/workflow/research/"
  "docs/logs/review-log.md"
)

git fetch origin develop

if git merge-base --is-ancestor origin/develop HEAD 2>/dev/null; then
  echo "✅ すでに develop を取り込み済みです"
  exit 0
fi

set +e
git merge origin/develop --no-edit
merge_status=$?
set -e

if [[ $merge_status -eq 0 ]]; then
  echo "✅ develop をマージしました（コンフリクトなし）"
  exit 0
fi

conflicts="$(git diff --name-only --diff-filter=U)"
if [[ -z "$conflicts" ]]; then
  echo "❌ マージ失敗（コンフリクト一覧を取得できません）" >&2
  exit 1
fi

while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  allowed=false
  for prefix in "${DOC_CONFLICT_PREFIXES[@]}"; do
    if [[ "$file" == "$prefix"* ]] || [[ "$file" == "$prefix" ]]; then
      allowed=true
      break
    fi
  done
  if [[ "$allowed" != true ]]; then
    echo "❌ 自動解消対象外のコンフリクト: $file" >&2
    echo "   手動で解消してください" >&2
    exit 1
  fi
done <<< "$conflicts"

echo "⚙️  ドキュメントのコンフリクトを feature ブランチ側で解消します:"
echo "$conflicts"

while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  git checkout --ours "$file"
  git add "$file"
done <<< "$conflicts"

git commit --no-edit
echo "✅ ドキュメントコンフリクトを自動解消してマージを完了しました"

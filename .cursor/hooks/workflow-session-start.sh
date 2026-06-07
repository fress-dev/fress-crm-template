#!/usr/bin/env bash
# sessionStart: 進行中の開発フローがあればエージェントへコンテキスト注入
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
STATE="$ROOT/.cursor/workflow-state.json"

if [[ ! -f "$STATE" ]]; then
  exit 0
fi

phase="$(jq -r '.phase // "idle"' "$STATE")"
if [[ "$phase" == "idle" ]]; then
  exit 0
fi

task="$(jq -r '.task // ""' "$STATE")"
branch="$(jq -r '.branch // ""' "$STATE")"
base="$(jq -r '.base_branch // "develop"' "$STATE")"
verdict="$(jq -r '.reviewer_verdict // "未実施"' "$STATE")"
tests="$(jq -r '.tests_passed // "未実施"' "$STATE")"
pr="$(jq -r '.pr_url // "なし"' "$STATE")"
git_branch="$(git -C "$ROOT" branch --show-current 2>/dev/null || echo unknown)"

cat <<EOF
{
  "additional_context": "【開発フロー進行中】task=$task phase=$phase branch=$branch (git:$git_branch) pr_base=$base reviewer=$verdict tests=$tests pr=$pr。main は本番相当で直接作業禁止。scripts/workflow.sh status で確認。PR は --base develop。詳細は .cursor/skills/development-workflow/SKILL.md"
}
EOF

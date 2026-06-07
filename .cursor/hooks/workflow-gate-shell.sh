#!/usr/bin/env bash
# beforeShellExecution: main への直接 commit/push をブロック（状態ファイル不要）
set -euo pipefail

input=$(cat)
command=$(echo "$input" | jq -r '.command // empty')

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MAIN_BRANCH="${MAIN_BRANCH:-main}"
DEVELOP_BRANCH="${DEVELOP_BRANCH:-develop}"

allow() {
  echo '{"permission":"allow"}'
  exit 0
}

deny() {
  local msg="$1"
  jq -n \
    --arg um "$msg" \
    --arg am "ブランチ戦略: main は本番相当。develop から feat/* を切って作業し、PR は --base develop で作成してください。" \
    '{permission:"deny",user_message:$um,agent_message:$am}'
  exit 2
}

ask() {
  local msg="$1"
  jq -n \
    --arg um "$msg" \
    --arg am "PR のマージ先を確認してください。" \
    '{permission:"ask",user_message:$um,agent_message:$am}'
  exit 0
}

branch="$(git -C "$ROOT" branch --show-current 2>/dev/null || echo "")"

if [[ "$branch" == "${MAIN_BRANCH}" ]]; then
  if echo "$command" | grep -qE '^git commit'; then
    deny "${MAIN_BRANCH} への直接コミットは禁止です。develop から feat/* ブランチを切って作業してください。"
  fi
  if echo "$command" | grep -qE '^git push[^;]* (origin )?main($| )'; then
    deny "${MAIN_BRANCH} への直接 push は禁止です。feat/* → ${DEVELOP_BRANCH} の PR を使ってください。"
  fi
fi

if echo "$command" | grep -qE 'gh pr create'; then
  if [[ "$branch" == "${MAIN_BRANCH}" ]]; then
    deny "PR は feat/* ブランチから作成してください。"
  fi
  if ! echo "$command" | grep -qE -- '--base[ =]'; then
    ask "PR のマージ先は ${DEVELOP_BRANCH} です。--base ${DEVELOP_BRANCH} を付けて作成してください。"
  fi
fi

allow

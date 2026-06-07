#!/usr/bin/env bash
# beforeShellExecution: フェーズとブランチに応じて git/gh 操作をゲート
set -euo pipefail

input=$(cat)
command=$(echo "$input" | jq -r '.command // empty')

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
STATE="$ROOT/.cursor/workflow-state.json"
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
    --arg am "開発フローの制約によりブロックしました。./scripts/workflow.sh status で確認してください。main では作業せず feat/* ブランチを使ってください。" \
    '{permission:"deny",user_message:$um,agent_message:$am}'
  exit 2
}

ask() {
  local msg="$1"
  jq -n \
    --arg um "$msg" \
    --arg am "開発フロー上、確認が必要な操作です。" \
    '{permission:"ask",user_message:$um,agent_message:$am}'
  exit 0
}

current_branch() {
  git -C "$ROOT" branch --show-current 2>/dev/null || echo ""
}

branch="$current_branch"

# --- 常時: main への直接コミット禁止（ワークフロー有無に関わらず） ---
if [[ "$branch" == "${MAIN_BRANCH}" ]]; then
  if echo "$command" | grep -qE '^git commit'; then
    deny "${MAIN_BRANCH} ブランチへの直接コミットは禁止です。./scripts/workflow.sh start で feat ブランチを作成して作業してください。"
  fi
  if echo "$command" | grep -qE '^git push[^;]* (origin )?main($| )'; then
    deny "${MAIN_BRANCH} への直接 push は禁止です。feat/* → ${DEVELOP_BRANCH} の PR を使ってください。"
  fi
fi

# ワークフロー未開始ならここまで
if [[ ! -f "$STATE" ]]; then
  allow
fi

phase="$(jq -r '.phase // "idle"' "$STATE")"
verdict="$(jq -r '.reviewer_verdict // ""' "$STATE")"
tests="$(jq -r '.tests_passed // ""' "$STATE")"
wf_branch="$(jq -r '.branch // ""' "$STATE")"

if [[ "$phase" == "idle" ]]; then
  allow
fi

# 開発フェーズ中は main に checkout しない
if [[ "$phase" != "done" && "$branch" == "${MAIN_BRANCH}" ]]; then
  if echo "$command" | grep -qE '^git (checkout|switch)'; then
    : # checkout away from main is OK
  elif echo "$command" | grep -qE '^git (add|commit|push|merge|rebase)'; then
    deny "ワークフロー進行中は ${MAIN_BRANCH} で作業できません。feat ブランチ（${wf_branch:-未設定}）に切り替えてください。"
  fi
fi

# feat 以外への push を PR 前に警告（任意）
if echo "$command" | grep -qE '^git push'; then
  if [[ "$branch" == "${MAIN_BRANCH}" ]]; then
    deny "${MAIN_BRANCH} への push は禁止です。"
  fi
fi

# PR 作成: reviewer PASS + tests pass + base develop
if echo "$command" | grep -qE 'gh pr create'; then
  if [[ "$verdict" != "PASS" ]]; then
    deny "gh pr create の前に @reviewer PASS と record-review PASS が必要です。"
  fi
  if [[ "$tests" != "true" ]]; then
    deny "gh pr create の前にテスト実行と record-tests pass が必要です。"
  fi
  if [[ "$branch" == "${MAIN_BRANCH}" ]]; then
    deny "PR は feat/* ブランチから作成してください（base: ${DEVELOP_BRANCH}）。"
  fi
  if ! echo "$command" | grep -qE -- '--base[ =]'; then
    ask "PR のマージ先は ${DEVELOP_BRANCH} です。--base ${DEVELOP_BRANCH} を付けて作成してください。"
  fi
  if [[ "$phase" != "pr" && "$phase" != "approval_merge" && "$phase" != "done" ]]; then
    ask "phase を pr に進めてから PR を作成してください。続行しますか？"
  fi
fi

allow

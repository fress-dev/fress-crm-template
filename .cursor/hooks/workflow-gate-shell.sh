#!/usr/bin/env bash
# beforeShellExecution: main への直接 commit/push をブロック、作業ブランチ名・起点・PR base を検証
set -euo pipefail

input=$(cat)
command=$(echo "$input" | jq -r '.command // empty')

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MAIN_BRANCH="${MAIN_BRANCH:-main}"
DEVELOP_BRANCH="${DEVELOP_BRANCH:-develop}"

BRANCH_NAMING_HELP=$'許可される作業ブランチ:\n  feat/platform-<内容>       … コア（レジストリ・テナント設定）\n  feat/plugin-<機能名>-<内容> … プラグイン（appointments 等）\n  feat/plugin-realestate-* / feat/plugin-beauty-* … 業界専用ドメインのみ\n  fix/<内容>                 … バグ修正\n\ndevelop から作成し、PR は --base develop で。詳細: docs/workflow/branch-strategy.md'

allow() {
  echo '{"permission":"allow"}'
  exit 0
}

deny() {
  local msg="$1"
  jq -n \
    --arg um "$msg" \
    --arg am "$BRANCH_NAMING_HELP" \
    '{permission:"deny",user_message:$um,agent_message:$am}'
  exit 2
}

ask() {
  local msg="$1"
  jq -n \
    --arg um "$msg" \
    --arg am "PR のマージ先を確認してください。${BRANCH_NAMING_HELP}" \
    '{permission:"ask",user_message:$um,agent_message:$am}'
  exit 0
}

is_valid_work_branch() {
  local b="$1"
  [[ "$b" =~ ^feat/platform-.+ ]] && return 0
  [[ "$b" =~ ^feat/plugin-.+ ]] && return 0
  [[ "$b" =~ ^fix/.+ ]] && return 0
  return 1
}

extract_new_branch_from_checkout() {
  echo "$command" | sed -nE 's/.*git (checkout -b|switch -c) ([^ ;&|]+).*/\2/p' | head -1
}

branch_starts_from_develop() {
  echo "$command" | grep -qE "git (checkout -b|switch -c) [^ ]+ (origin/)?${DEVELOP_BRANCH}($|[ ;&|])"
}

push_targets_main() {
  echo "$command" | grep -qE 'HEAD:main|:main($|[ ;&|])| (origin )?main($|[ ;&|])'
}

pr_base_is_develop() {
  echo "$command" | grep -qE -- "--base[ =]${DEVELOP_BRANCH}($|[ ;&|\"'])|--base=${DEVELOP_BRANCH}($|[ ;&|\"'])"
}

extract_pr_base() {
  echo "$command" | sed -nE 's/.*--base[ =]([^ ;&|"]+).*/\1/p' | head -1
}

branch="$(git -C "$ROOT" branch --show-current 2>/dev/null || echo "")"

if [[ "$branch" == "${MAIN_BRANCH}" ]]; then
  if echo "$command" | grep -qE '^git commit'; then
    deny "${MAIN_BRANCH} への直接コミットは禁止です。${DEVELOP_BRANCH} から作業ブランチを切ってください。"
  fi
  if echo "$command" | grep -qE '^git push'; then
    deny "${MAIN_BRANCH} からの push は禁止です（git push / git push origin main 等を含む）。作業ブランチ → ${DEVELOP_BRANCH} の PR を使ってください。"
  fi
fi

if echo "$command" | grep -qE '^git push'; then
  if push_targets_main; then
    deny "main への push は禁止です。作業ブランチ → ${DEVELOP_BRANCH} の PR を使ってください。"
  fi
fi

if echo "$command" | grep -qE 'git (checkout -b|switch -c) '; then
  new_branch="$(extract_new_branch_from_checkout)"
  if [[ -n "$new_branch" ]] && ! is_valid_work_branch "$new_branch"; then
    deny "ブランチ名「${new_branch}」は命名規則に合いません。"
  fi
  if [[ -n "$new_branch" ]] && is_valid_work_branch "$new_branch"; then
    if ! branch_starts_from_develop && [[ "$branch" != "${DEVELOP_BRANCH}" ]]; then
      deny "作業ブランチ「${new_branch}」は ${DEVELOP_BRANCH} から作成してください（現在: ${branch:-（detached）}）。例: git checkout ${DEVELOP_BRANCH} && git checkout -b ${new_branch}"
    fi
  fi
fi

if echo "$command" | grep -qE '^git commit'; then
  if [[ -n "$branch" && "$branch" != "${MAIN_BRANCH}" && "$branch" != "${DEVELOP_BRANCH}" ]]; then
    if ! is_valid_work_branch "$branch"; then
      deny "現在のブランチ「${branch}」は命名規則に合いません。git branch -m でリネームしてください。"
    fi
  fi
fi

if echo "$command" | grep -qE '^git push'; then
  if [[ -n "$branch" && "$branch" != "${MAIN_BRANCH}" && "$branch" != "${DEVELOP_BRANCH}" ]]; then
    if ! is_valid_work_branch "$branch"; then
      deny "push 先ブランチ「${branch}」は命名規則に合いません。"
    fi
  fi
fi

if echo "$command" | grep -qE 'gh pr create'; then
  if [[ "$branch" == "${MAIN_BRANCH}" ]]; then
    deny "PR は作業ブランチ（feat/platform-* / feat/plugin-* / fix/*）から作成してください。"
  fi
  if [[ -n "$branch" && "$branch" != "${DEVELOP_BRANCH}" ]] && ! is_valid_work_branch "$branch"; then
    deny "PR 元ブランチ「${branch}」は命名規則に合いません。"
  fi
  if echo "$command" | grep -qE -- '--base[ =]'; then
    if pr_base_is_develop; then
      :
    else
      pr_base="$(extract_pr_base)"
      deny "PR のマージ先は ${DEVELOP_BRANCH} のみです（指定: ${pr_base:-不明}）。--base ${DEVELOP_BRANCH} を使ってください。"
    fi
  else
    ask "PR のマージ先は ${DEVELOP_BRANCH} です。--base ${DEVELOP_BRANCH} を付けて作成してください。"
  fi
fi

allow

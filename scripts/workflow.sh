#!/usr/bin/env bash
# 開発フロー（調査→計画→承認→開発→レビュー→テスト→PR→マージ）のフェーズ管理
# ブランチ戦略: main=本番相当 / develop=開発統合 / feat/*=タスク作業
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STATE_FILE="$ROOT/.cursor/workflow-state.json"
MAIN_BRANCH="${MAIN_BRANCH:-main}"
DEVELOP_BRANCH="${DEVELOP_BRANCH:-develop}"

PHASES=(
  idle research plan approval_plan develop review test pr approval_merge done
)

slugify() {
  local s
  s="$(echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[[:space:]]\+/-/g' | sed 's/[^a-z0-9-]//g' | sed 's/-\+/-/g' | sed 's/^-\|-$//g')"
  [[ -n "$s" ]] || s="task"
  echo "$s" | cut -c1-40
}

usage() {
  cat <<EOF
Usage:
  workflow.sh start <task>              新タスク開始 + feat ブランチ作成
  workflow.sh ensure-develop            develop ブランチを用意（main から初回のみ）
  workflow.sh phase <phase>             フェーズを遷移（検証あり）
  workflow.sh approve plan              計画を承認 → develop フェーズへ
  workflow.sh approve merge             マージを承認 → done へ
  workflow.sh record-review PASS|FAIL   reviewer 結果を記録
  workflow.sh record-tests pass|fail    テスト結果を記録
  workflow.sh record-pr <url>           PR URL を記録 → approval_merge へ
  workflow.sh status                    現在状態を表示
  workflow.sh reset                     idle にリセット

ブランチ戦略:
  ${MAIN_BRANCH}     本番相当（直接コミット・push 禁止）
  ${DEVELOP_BRANCH}  開発統合ブランチ
  feat/*     タスク作業ブランチ（start で自動作成）

フェーズ順:
  research → plan → approval_plan →(人間承認)→ develop → review → test → pr → approval_merge →(人間承認)→ done
EOF
}

ensure_develop_branch() {
  cd "$ROOT"
  if git show-ref --quiet "refs/heads/${DEVELOP_BRANCH}"; then
    return 0
  fi
  if git show-ref --quiet "refs/remotes/origin/${DEVELOP_BRANCH}"; then
    git branch "${DEVELOP_BRANCH}" "origin/${DEVELOP_BRANCH}"
    echo "develop: origin/${DEVELOP_BRANCH} から作成" >&2
    return 0
  fi
  git branch "${DEVELOP_BRANCH}" "${MAIN_BRANCH}" >&2
  echo "develop: ${MAIN_BRANCH} から初回作成（ローカル）" >&2
}

create_feature_branch() {
  local task="$1"
  local slug branch

  cd "$ROOT"
  ensure_develop_branch >&2

  slug="$(slugify "$task")"
  branch="feat/${slug}"

  if git show-ref --quiet "refs/heads/${branch}"; then
    git checkout "${branch}" >&2
    echo "既存ブランチに切替: ${branch}" >&2
  else
    git checkout "${DEVELOP_BRANCH}" >&2
    git checkout -b "${branch}" >&2
    echo "新規ブランチ作成: ${branch} (from ${DEVELOP_BRANCH})" >&2
  fi

  echo "${branch}"
}

init_state() {
  local task="$1"
  local branch="$2"

  mkdir -p "$(dirname "$STATE_FILE")"
  cat >"$STATE_FILE" <<EOF
{
  "task": $(jq -Rn --arg t "$task" '$t'),
  "branch": $(jq -Rn --arg b "$branch" '$b'),
  "base_branch": "${DEVELOP_BRANCH}",
  "phase": "research",
  "research_summary": null,
  "plan_summary": null,
  "reviewer_verdict": null,
  "tests_passed": null,
  "pr_url": null,
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
}

read_state() {
  if [[ ! -f "$STATE_FILE" ]]; then
    echo '{"phase":"idle"}'
    return
  fi
  cat "$STATE_FILE"
}

write_state() {
  local json="$1"
  mkdir -p "$(dirname "$STATE_FILE")"
  echo "$json" | jq --arg now "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '.updated_at = $now' >"$STATE_FILE"
}

phase_index() {
  local p="$1"
  local i=0
  for x in "${PHASES[@]}"; do
    if [[ "$x" == "$p" ]]; then
      echo "$i"
      return 0
    fi
    i=$((i + 1))
  done
  echo "-1"
}

assert_not_on_main() {
  cd "$ROOT"
  local current
  current="$(git branch --show-current)"
  if [[ "$current" == "${MAIN_BRANCH}" ]]; then
    echo "エラー: ${MAIN_BRANCH} ブランチでは作業できません。./scripts/workflow.sh start で feat ブランチを作成してください。" >&2
    exit 1
  fi
}

cmd="${1:-}"
shift || true

case "$cmd" in
  ensure-develop)
    ensure_develop_branch
    ;;
  start)
    task="${*:-}"
    [[ -n "$task" ]] || { echo "task を指定してください" >&2; exit 1; }
    branch="$(create_feature_branch "$task")"
    init_state "$task" "$branch"
    echo "開始: $task"
    echo "  branch: $branch"
    echo "  phase:  research"
    echo "  PR 先:  ${DEVELOP_BRANCH}（${MAIN_BRANCH} には直接マージしない）"
    ;;
  phase)
    target="${1:-}"
    [[ -n "$target" ]] || { usage; exit 1; }
    state="$(read_state)"
    current="$(echo "$state" | jq -r '.phase')"
    if [[ "$(phase_index "$target")" -lt 0 ]]; then
      echo "不明なフェーズ: $target" >&2
      exit 1
    fi
    if [[ "$target" == "develop" && "$current" == "approval_plan" ]]; then
      echo "approval_plan → develop は 'workflow.sh approve plan' を使ってください" >&2
      exit 1
    fi
    if [[ "$target" == "done" && "$current" == "approval_merge" ]]; then
      echo "approval_merge → done は 'workflow.sh approve merge' を使ってください" >&2
      exit 1
    fi
    if [[ "$target" != "idle" && "$target" != "research" && "$target" != "plan" && "$target" != "approval_plan" ]]; then
      assert_not_on_main
    fi
    write_state "$(echo "$state" | jq --arg p "$target" '.phase = $p')"
    echo "phase: $current → $target"
    ;;
  approve)
    gate="${1:-}"
    state="$(read_state)"
    current="$(echo "$state" | jq -r '.phase')"
    case "$gate" in
      plan)
        [[ "$current" == "approval_plan" ]] || {
          echo "approval_plan フェーズでのみ計画承認できます (現在: $current)" >&2
          exit 1
        }
        assert_not_on_main
        write_state "$(echo "$state" | jq '.phase = "develop"')"
        echo "計画承認 → develop フェーズ（branch: $(echo "$state" | jq -r '.branch')）"
        ;;
      merge)
        [[ "$current" == "approval_merge" ]] || {
          echo "approval_merge フェーズでのみマージ承認できます (現在: $current)" >&2
          exit 1
        }
        write_state "$(echo "$state" | jq '.phase = "done"')"
        echo "マージ承認 → done"
        ;;
      *)
        echo "approve plan | approve merge" >&2
        exit 1
        ;;
    esac
    ;;
  record-review)
    verdict="${1:-}"
    state="$(read_state)"
    case "$verdict" in
      PASS|FAIL) ;;
      *) echo "PASS または FAIL" >&2; exit 1 ;;
    esac
    write_state "$(echo "$state" | jq --arg v "$verdict" '.reviewer_verdict = $v')"
    echo "reviewer_verdict: $verdict"
    ;;
  record-tests)
    result="${1:-}"
    state="$(read_state)"
    case "$result" in
      pass) val=true ;;
      fail) val=false ;;
      *) echo "pass または fail" >&2; exit 1 ;;
    esac
    write_state "$(echo "$state" | jq --argjson v "$val" '.tests_passed = $v')"
    echo "tests_passed: $val"
    ;;
  record-pr)
    url="${1:-}"
    [[ -n "$url" ]] || { echo "PR URL を指定してください" >&2; exit 1; }
    state="$(read_state)"
    write_state "$(echo "$state" | jq --arg u "$url" '.pr_url = $u | .phase = "approval_merge"')"
    echo "PR 記録 → approval_merge: $url"
    ;;
  status)
    cd "$ROOT"
    read_state | jq --arg cur "$(git branch --show-current 2>/dev/null || echo unknown)" \
      '. + {current_git_branch: $cur}'
    ;;
  reset)
    write_state "$(jq -n \
      --arg bb "${DEVELOP_BRANCH}" \
      '{task:null,branch:null,base_branch:$bb,phase:"idle",research_summary:null,plan_summary:null,reviewer_verdict:null,tests_passed:null,pr_url:null}')"
    echo "reset → idle"
    ;;
  *)
    usage
    exit 1
    ;;
esac

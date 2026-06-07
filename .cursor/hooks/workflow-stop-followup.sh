#!/usr/bin/env bash
# stop: エージェント停止時に次フェーズの follow-up を提案
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
STATE="$ROOT/.cursor/workflow-state.json"

if [[ ! -f "$STATE" ]]; then
  exit 0
fi

phase="$(jq -r '.phase // "idle"' "$STATE")"
task="$(jq -r '.task // ""' "$STATE")"

case "$phase" in
  research)
    msg="【開発フロー】$task — 調査が終わったら @planner に計画を依頼し、完了後 ./scripts/workflow.sh phase plan → approval_plan へ。"
    ;;
  plan|approval_plan)
    msg="【開発フロー】$task — 計画承認待ち。内容を確認し ./scripts/workflow.sh approve plan で開発フェーズへ。"
    ;;
  develop)
    msg="【開発フロー】$task — 実装後は ./scripts/workflow.sh phase review → @reviewer を実行し record-review PASS/FAIL。"
    ;;
  review)
    msg="【開発フロー】$task — reviewer 後は make test && make test-e2e → record-tests pass → phase test → phase pr。"
    ;;
  test)
    msg="【開発フロー】$task — テスト完了後 ./scripts/workflow.sh phase pr → gh pr create → record-pr <url>。"
    ;;
  pr)
    msg="【開発フロー】$task — PR 作成後 record-pr で approval_merge へ。マージ前に人間が確認。"
    ;;
  approval_merge)
    msg="【開発フロー】$task — マージ承認待ち。PR を確認し ./scripts/workflow.sh approve merge。"
    ;;
  *)
    exit 0
    ;;
esac

jq -n --arg m "$msg" '{followup_message:$m}'

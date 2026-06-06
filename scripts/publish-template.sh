#!/usr/bin/env bash
# GitHub に fress-crm-template を作成して初回 push するスクリプト
set -euo pipefail

REPO_NAME="${1:-fress-crm-template}"
VISIBILITY="${2:-public}" # public | private
GITHUB_OWNER="${GITHUB_OWNER:-fress-dev}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI が必要です: brew install gh && gh auth login"
  exit 1
fi

gh auth status >/dev/null 2>&1 || {
  echo "先に GitHub にログインしてください: gh auth login"
  exit 1
}

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/${GITHUB_OWNER}/${REPO_NAME}.git"
fi

if gh repo view "${GITHUB_OWNER}/${REPO_NAME}" >/dev/null 2>&1; then
  echo "リポジトリ ${GITHUB_OWNER}/${REPO_NAME} は既に存在します。push のみ実行します。"
else
  gh repo create "${GITHUB_OWNER}/${REPO_NAME}" \
    --"${VISIBILITY}" \
    --source=. \
    --remote=origin \
    --description "Atomic CRM extension template (fork of marmelab/atomic-crm)"
fi

git push -u origin main

echo ""
echo "完了。GitHub のリポジトリ設定で「Template repository」にチェックを入れると、"
echo "「Use this template」から新規プロジェクトを作成できます。"

#!/usr/bin/env bash
# e2e 用 Supabase 起動後に .env.e2e へキーを反映する（CI / make test-e2e-ci 向け）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="$ROOT/.env.e2e"

if ! status_e2e="$(npx supabase status -o env --workdir .supabase-e2e 2>/dev/null)"; then
  echo "e2e 用 Supabase が起動していません（make start-e2e-ci を先に実行してください）"
  exit 1
fi

api_url="$(echo "$status_e2e" | grep '^API_URL=' | cut -d= -f2- | tr -d '"')"
publishable_key="$(echo "$status_e2e" | grep '^PUBLISHABLE_KEY=' | cut -d= -f2- | tr -d '"')"
service_role_key="$(echo "$status_e2e" | grep '^SERVICE_ROLE_KEY=' | cut -d= -f2- | tr -d '"')"

if [[ -z "$api_url" || -z "$publishable_key" || -z "$service_role_key" ]]; then
  echo "e2e Supabase から API_URL / PUBLISHABLE_KEY / SERVICE_ROLE_KEY を取得できませんでした"
  exit 1
fi

upsert() {
  local file="$1"
  local key="$2"
  local value="$3"
  if [[ ! -f "$file" ]]; then
    echo "$key=$value" >>"$file"
    return
  fi
  if grep -q "^${key}=" "$file"; then
    if [[ "$(uname -s)" == "Darwin" ]]; then
      sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
    else
      sed -i "s|^${key}=.*|${key}=${value}|" "$file"
    fi
  else
    echo "$key=$value" >>"$file"
  fi
}

upsert "$ENV_FILE" "VITE_SUPABASE_URL" "$api_url"
upsert "$ENV_FILE" "VITE_SB_PUBLISHABLE_KEY" "$publishable_key"
upsert "$ENV_FILE" "SERVICE_ROLE_KEY" "$service_role_key"

echo "==> .env.e2e を e2e Supabase のキーで更新しました"

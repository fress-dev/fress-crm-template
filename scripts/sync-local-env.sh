#!/usr/bin/env bash
# ローカル Supabase 起動後に .env 系ファイルへキーを反映する
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

read_env() {
  local workdir="${1:-}"
  local args=(-o env)
  if [[ -n "$workdir" ]]; then
    args+=(--workdir "$workdir")
  fi
  npx supabase status "${args[@]}" 2>/dev/null
}

upsert() {
  local file="$1"
  local key="$2"
  local value="$3"
  if [[ ! -f "$file" ]]; then
    echo "$key=$value" >>"$file"
    return
  fi
  if grep -q "^${key}=" "$file"; then
    sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
  else
    echo "$key=$value" >>"$file"
  fi
}

sync_from_status() {
  local status="$1"
  local env_dev="$ROOT/.env.development"
  local env_functions="$ROOT/supabase/functions/.env"

  local api_url publishable_key
  api_url="$(echo "$status" | grep '^API_URL=' | cut -d= -f2- | tr -d '"')"
  publishable_key="$(echo "$status" | grep '^PUBLISHABLE_KEY=' | cut -d= -f2- | tr -d '"')"

  if [[ -z "$api_url" || -z "$publishable_key" ]]; then
    echo "Supabase の API_URL / PUBLISHABLE_KEY を取得できませんでした。"
    exit 1
  fi

  upsert "$env_dev" "VITE_SUPABASE_URL" "$api_url"
  upsert "$env_dev" "VITE_SB_PUBLISHABLE_KEY" "$publishable_key"
  upsert "$env_functions" "SB_JWT_ISSUER" "${api_url}/auth/v1"
  upsert "$env_functions" "SB_PUBLISHABLE_KEY" "$publishable_key"
}

echo "==> 開発用 Supabase (.env.development, supabase/functions/.env)"
if ! status="$(read_env)"; then
  echo "先に \`make start-supabase\` または \`make start\` で Supabase を起動してください。"
  exit 1
fi
sync_from_status "$status"

echo "==> e2e 用 Supabase (.env.e2e)"
if status_e2e="$(read_env ".supabase-e2e")"; then
  local_api_url="$(echo "$status_e2e" | grep '^API_URL=' | cut -d= -f2- | tr -d '"')"
  local_publishable="$(echo "$status_e2e" | grep '^PUBLISHABLE_KEY=' | cut -d= -f2- | tr -d '"')"
  local_service_role="$(echo "$status_e2e" | grep '^SERVICE_ROLE_KEY=' | cut -d= -f2- | tr -d '"')"
  upsert "$ROOT/.env.e2e" "VITE_SUPABASE_URL" "$local_api_url"
  upsert "$ROOT/.env.e2e" "VITE_SB_PUBLISHABLE_KEY" "$local_publishable"
  upsert "$ROOT/.env.e2e" "SERVICE_ROLE_KEY" "$local_service_role"
else
  echo "e2e 用 Supabase は未起動のためスキップ（\`make start-e2e\` 実行後に再実行）"
fi

echo "完了。ローカル用 .env を更新しました。"

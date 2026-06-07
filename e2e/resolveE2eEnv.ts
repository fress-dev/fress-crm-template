import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PLACEHOLDER_SERVICE_ROLE_KEY = "local_supabase_service_role_key";

const isJwtShape = (value: string) => value.split(".").length === 3;

const parseStatusEnv = (status: string, key: string): string | undefined => {
  const line = status.split("\n").find((l) => l.startsWith(`${key}=`));
  if (!line) return undefined;
  return line.slice(key.length + 1).replace(/^"|"$/g, "");
};

/** 起動中の e2e Supabase から SERVICE_ROLE_KEY を取得（CI 用） */
export const resolveServiceRoleKey = (): string => {
  const fromEnv = process.env.SERVICE_ROLE_KEY;
  if (fromEnv && isJwtShape(fromEnv) && fromEnv !== PLACEHOLDER_SERVICE_ROLE_KEY) {
    return fromEnv;
  }

  try {
    const status = execSync("npx supabase status -o env --workdir .supabase-e2e", {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    const key = parseStatusEnv(status, "SERVICE_ROLE_KEY");
    if (key && isJwtShape(key)) {
      return key;
    }
  } catch {
    // e2e Supabase 未起動
  }

  throw new Error(
    "SERVICE_ROLE_KEY が無効です。`make test-e2e-ci` を使うか、Supabase e2e 起動後に `scripts/sync-e2e-env.sh` を実行してください。",
  );
};

export const resolveSupabaseUrl = (): string =>
  process.env.VITE_SUPABASE_URL ?? "http://127.0.0.1:54341";

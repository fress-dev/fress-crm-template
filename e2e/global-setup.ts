import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Playwright 実行前に .env.e2e を e2e Supabase の実キーで同期する */
export default async function globalSetup() {
  const syncScript = path.join(ROOT, "scripts/sync-e2e-env.sh");
  try {
    execSync(syncScript, { cwd: ROOT, stdio: "inherit" });
  } catch {
    // ローカルで Supabase 未起動のときは .env.e2e のまま（手動 sync 前提）
  }

  dotenv.config({
    path: path.join(ROOT, ".env.e2e"),
    override: true,
  });
}

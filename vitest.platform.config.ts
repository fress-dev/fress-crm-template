import path from "node:path";
import { defineConfig } from "vitest/config";

/** platform 層の純粋ロジック用（ブラウザ不要） */
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "src/custom/platform/**/*.test.ts",
      "src/custom/plugins/**/*.test.ts",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.DEV": JSON.stringify(true),
    "import.meta.env.PROD": JSON.stringify(false),
  },
});

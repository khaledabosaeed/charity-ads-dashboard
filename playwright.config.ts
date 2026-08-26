import { defineConfig, devices } from "@playwright/test";

/**
 * Requires a running app pointed at a live Supabase instance, seeded with
 * the test users described in tests/e2e/README.md. Not runnable in this
 * sandbox (no Docker/local Supabase available) — see project README.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

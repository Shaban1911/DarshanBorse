import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end checks run against the dev server (started here if not already
 * running). Locally the system Chrome is used so nothing needs downloading;
 * CI installs Playwright's own Chromium.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: process.env["CI"] ? 1 : 0,
  reporter: process.env["CI"] ? "github" : "list",
  use: {
    baseURL: "http://localhost:8080",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "phone",
      use: {
        ...devices["Pixel 7"],
        ...(process.env["CI"] ? {} : { channel: "chrome" }),
      },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env["CI"] ? {} : { channel: "chrome" }),
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080/?intro=0",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

function resolveBaseUrl(): string {

  if (process.env.BASE_URL) return process.env.BASE_URL;

  const env = (process.env.TTA_ENV || "qa").toLowerCase();
  switch (env) {
    case "local":
      return process.env.LOCAL_BASE_URL || "https://app.wingify.com/#/login";

    case "dev":
      return process.env.DEV_BASE_URL || "https://dev.skeye.cloud/auth/login";

    case "stg":
    case "stage":
    case "staging":
      return process.env.STG_BASE_URL || "https://stage.skeye.cloud/auth/login";

    case "qa":
    default:
      return process.env.QA_BASE_URL || "https://app.thetestingacademy.com";

  }
}
export default defineConfig({
  testDir: './src/tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 6,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['./src/utils/CustomReporter.ts'],
  ],
  use: {
    baseURL: "https://app.thetestingacademy.com",
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }/* ,
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    } */]
});
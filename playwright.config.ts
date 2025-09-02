// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { ENV, validateEnvironment } from './src/utils/env.js';

// Validate environment before running tests
validateEnvironment();

export default defineConfig({
  testDir: './tests',
  timeout: 60000, // Increase test timeout to 60 seconds
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],

  use: {
    baseURL: ENV.BASE_URL,
    trace: 'on-first-retry',
    screenshot: ENV.TEST_CONFIG.screenshotMode as any,
    video: ENV.TEST_CONFIG.videoMode as any,
    actionTimeout: ENV.TIMEOUTS.DEFAULT,
    navigationTimeout: ENV.TIMEOUTS.NAVIGATION,

    // Use environment-based headless setting
    headless: ENV.TEST_CONFIG.headless,

    // Slow motion for debugging
    launchOptions: {
      slowMo: ENV.TEST_CONFIG.slowMo
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
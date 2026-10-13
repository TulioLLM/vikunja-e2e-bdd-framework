import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { env } from './src/config/env.js';

const testDir = defineBddConfig({
  features: 'src/tests/features/**/*.feature',
  steps: ['src/tests/step-definitions/**/*.ts', 'src/tests/fixtures/**/*.ts'],
});

export default defineConfig({
  testDir,
  globalTeardown: './src/tests/global-teardown.ts',
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 0,
  workers: env.workers,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: env.isCI
    ? [['html', { open: 'never' }], ['list'], ['github']]
    : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: env.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});

import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'src/tests/features/**/*.feature',
  steps: ['src/tests/step-definitions/**/*.ts', 'src/tests/fixtures/**/*.ts'],
});

export default defineConfig({
  testDir,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:3456',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});

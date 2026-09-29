import { test as base } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import type { VikunjaSession } from '@api/vikunjaClient.js';

export const authFixture = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page, vikunjaSession }: any, use) => {
    const session = vikunjaSession as VikunjaSession;
    await page.addInitScript((token: string) => {
      window.localStorage.setItem('token', token);
    }, session.token);

    await page.goto('/');
    await use(page);
  },
});

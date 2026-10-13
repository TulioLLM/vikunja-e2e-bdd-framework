import { test as base } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import { VikunjaClient } from '@api/vikunjaClient.js';
import type { VikunjaProject } from '@api/vikunjaClient.js';
import { ProjectPage } from '@pages/project.page.js';
import { TaskDetailPage } from '@pages/task-detail.page.js';

/** Per-scenario state shared between steps. */
export class ScenarioContext {
  private currentProject?: VikunjaProject;

  set project(project: VikunjaProject) {
    this.currentProject = project;
  }

  get project(): VikunjaProject {
    if (!this.currentProject) {
      throw new Error('No project in scenario context. Add a "Given the user has a project" step.');
    }
    return this.currentProject;
  }
}

interface Fixtures {
  ctx: ScenarioContext;
  api: VikunjaClient;
  authenticatedPage: Page;
  projectPage: ProjectPage;
  taskDetailPage: TaskDetailPage;
}

/**
 * Fixture chain (each fixture may depend on the ones above it):
 * - ctx: scenario state shared between steps.
 * - api: a fresh user per test; deletes every project it created on teardown.
 * - authenticatedPage: browser page logged in as that user (token injected, no UI login).
 * - projectPage / taskDetailPage: page objects bound to the authenticated page.
 */
export const test = base.extend<Fixtures>({
  ctx: async ({}, use) => {
    await use(new ScenarioContext());
  },

  api: async ({ request }, use) => {
    const client = await VikunjaClient.register(request);
    await use(client);
    await client.cleanup();
  },

  authenticatedPage: async ({ page, api }, use) => {
    await page.addInitScript((token: string) => {
      window.localStorage.setItem('token', token);
    }, api.session.token);
    await use(page);
  },

  projectPage: async ({ authenticatedPage }, use) => {
    await use(new ProjectPage(authenticatedPage));
  },

  taskDetailPage: async ({ authenticatedPage }, use) => {
    await use(new TaskDetailPage(authenticatedPage));
  },
});

export { expect } from '@playwright/test';

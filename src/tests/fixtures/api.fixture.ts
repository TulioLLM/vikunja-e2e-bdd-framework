import { test as base } from 'playwright-bdd';
import { createProject, deleteProject, registerAndLogin } from '@api/vikunjaClient.js';
import type { VikunjaSession } from '@api/vikunjaClient.js';
import type { TestContext } from '@fixtures/context.fixture.js';

export const apiFixture = base.extend<{ vikunjaSession: VikunjaSession }>({
  vikunjaSession: async ({ testContext }: any, use) => {
    const ctx = testContext as TestContext;
    const session = await registerAndLogin();
    await use(session);

    // Teardown: borra automáticamente cada proyecto creado durante el test
    for (const id of ctx.createdProjectIds) {
      await deleteProject(session.token, id);
    }
  },
});

export { createProject };

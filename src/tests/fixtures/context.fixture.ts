import { test as base } from 'playwright-bdd';

export interface TestContext {
  createdProjectIds: number[];
}

export const contextFixture = base.extend<{ testContext: TestContext }>({
  testContext: async ({}, use) => {
    const context: TestContext = { createdProjectIds: [] };
    await use(context);
    // El borrado real ocurre en api.fixture.ts, que tiene acceso al token de sesión
  },
});

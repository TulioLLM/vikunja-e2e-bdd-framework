import { test, expect } from '@fixtures/test.fixture.js';
import { createProject } from '@api/vikunjaClient.js';

test('la fixture de sesión funciona de punta a punta', async ({ vikunjaSession, testContext }) => {
  expect(vikunjaSession.token).toBeTruthy();
  const project = await createProject(vikunjaSession.token, 'Proyecto de prueba');
  testContext.createdProjectIds.push(project.id);
  expect(project.id).toBeGreaterThan(0);
});

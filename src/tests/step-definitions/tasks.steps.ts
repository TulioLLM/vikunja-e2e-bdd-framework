import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/test.fixture.js';
import { createProject } from '@api/vikunjaClient.js';
import { BoardPage } from '@pages/board.page.js';

const { Given, When, Then } = createBdd(test);

Given(
  'el usuario tiene un proyecto llamado {string}',
  async ({ vikunjaSession, testContext, authenticatedPage }, title: string) => {
    const project = await createProject(vikunjaSession.token, title);
    testContext.createdProjectIds.push(project.id);

    await authenticatedPage.goto(`/projects/${project.id}`);
  },
);

When('el usuario agrega la tarea {string}', async ({ authenticatedPage }, taskTitle: string) => {
  const board = new BoardPage(authenticatedPage);
  await board.addTask(taskTitle);
});

Then(
  'la tarea {string} aparece en el tablero',
  async ({ authenticatedPage }, taskTitle: string) => {
    const board = new BoardPage(authenticatedPage);
    await expect(board.getTaskByTitle(taskTitle)).toBeVisible();
  },
);

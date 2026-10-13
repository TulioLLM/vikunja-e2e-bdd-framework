import { createBdd } from 'playwright-bdd';
import { test, expect } from '@fixtures/test.fixture.js';

const { Given, When, Then } = createBdd(test);

Given('the user has a project named {string}', async ({ api, ctx, projectPage }, title: string) => {
  ctx.project = await api.createProject(title);
  await projectPage.open(ctx.project.id);
});

Given('the project has a task {string}', async ({ api, ctx, projectPage }, title: string) => {
  await api.createTask(ctx.project.id, title);
  // Reload so the task seeded through the API shows up in the list
  await projectPage.open(ctx.project.id);
});

When('the user adds the task {string}', async ({ projectPage }, title: string) => {
  await projectPage.addTask(title);
});

When(
  'the user renames the task {string} to {string}',
  async ({ projectPage, taskDetailPage }, oldTitle: string, newTitle: string) => {
    await projectPage.openTask(oldTitle);
    await taskDetailPage.rename(newTitle);
    await taskDetailPage.backToProject();
  },
);

When('the user marks the task {string} as done', async ({ projectPage }, title: string) => {
  await projectPage.markDone(title);
});

When(
  'the user deletes the task {string}',
  async ({ projectPage, taskDetailPage }, title: string) => {
    await projectPage.openTask(title);
    await taskDetailPage.delete();
  },
);

Then('the task {string} is shown in the project', async ({ projectPage }, title: string) => {
  await expect(projectPage.task(title)).toBeVisible();
});

Then('the task {string} is not shown in the project', async ({ projectPage }, title: string) => {
  await expect(projectPage.task(title)).toBeHidden();
});

Then('the task {string} is marked as done', async ({ api, ctx, projectPage }, title: string) => {
  await expect(projectPage.doneCheckbox(title)).toBeChecked();
  await expect
    .poll(async () => (await api.findTaskByTitle(ctx.project.id, title))?.done)
    .toBe(true);
});

Then('the user is asked to specify a title', async ({ projectPage }) => {
  await expect(projectPage.emptyTitleError).toBeVisible();
});

Then('the project has no tasks', async ({ api, ctx }) => {
  expect(await api.listTasks(ctx.project.id)).toHaveLength(0);
});

import type { Locator, Page } from '@playwright/test';
import { projectLocators } from '@locators/project.locators.js';

/** Project List view: add tasks, toggle them done and open their detail. */
export class ProjectPage {
  readonly taskInput: Locator;
  readonly addTaskButton: Locator;
  readonly emptyTitleError: Locator;

  constructor(private readonly page: Page) {
    this.taskInput = page.getByRole('textbox', { name: projectLocators.taskInputName });
    this.addTaskButton = page.getByRole('button', {
      name: projectLocators.addTaskButtonName,
      exact: true,
    });
    this.emptyTitleError = page.getByText(projectLocators.emptyTitleError);
  }

  async open(projectId: number): Promise<void> {
    await this.page.goto(`/projects/${projectId}`);
    await this.taskInput.waitFor();
  }

  async addTask(taskTitle: string): Promise<void> {
    await this.taskInput.fill(taskTitle);
    await this.addTaskButton.click();
  }

  task(taskTitle: string): Locator {
    return this.page.getByRole('link', { name: taskTitle, exact: true });
  }

  doneCheckbox(taskTitle: string): Locator {
    return this.page.getByRole('checkbox', { name: projectLocators.doneCheckboxName(taskTitle) });
  }

  async markDone(taskTitle: string): Promise<void> {
    // The native checkbox is visually hidden (sr-only); its wrapping <label> is what users click.
    await this.page.locator('label', { has: this.doneCheckbox(taskTitle) }).click();
  }

  async openTask(taskTitle: string): Promise<void> {
    await this.task(taskTitle).click();
  }
}

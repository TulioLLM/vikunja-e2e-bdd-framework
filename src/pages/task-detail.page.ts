import type { Locator, Page } from '@playwright/test';
import { taskDetailLocators } from '@locators/task-detail.locators.js';

/** Task detail view: rename and delete a task. */
export class TaskDetailPage {
  readonly titleHeading: Locator;
  private readonly savedNotice: Locator;
  private readonly backToProjectButton: Locator;
  private readonly deleteButton: Locator;
  private readonly deleteDialog: Locator;

  constructor(private readonly page: Page) {
    this.titleHeading = page.getByRole('heading', { name: taskDetailLocators.titleHeadingName });
    this.savedNotice = page.getByText(taskDetailLocators.savedNotice);
    this.backToProjectButton = page.getByRole('button', {
      name: taskDetailLocators.backToProjectButtonName,
    });
    this.deleteButton = page.getByRole('button', {
      name: taskDetailLocators.deleteButtonName,
      exact: true,
    });
    this.deleteDialog = page.getByRole('dialog', { name: taskDetailLocators.deleteDialogName });
  }

  async rename(newTitle: string): Promise<void> {
    // The title is a contenteditable heading; Enter commits the change.
    await this.titleHeading.click();
    await this.titleHeading.fill(newTitle);
    await this.titleHeading.press('Enter');
    await this.savedNotice.waitFor();
  }

  async delete(): Promise<void> {
    await this.deleteButton.click();
    await this.deleteDialog
      .getByRole('button', { name: taskDetailLocators.confirmDeleteButtonName })
      .click();
    // Vikunja returns to the project view once the task is gone
    await this.page.waitForURL(/\/projects\//);
  }

  async backToProject(): Promise<void> {
    await this.backToProjectButton.click();
    await this.page.waitForURL(/\/projects\//);
  }
}

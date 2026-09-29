import type { Locator, Page } from '@playwright/test';
import { boardLocators } from '@locators/board.locators.js';

export class BoardPage {
  private readonly taskInput: Locator;
  private readonly addButton: Locator;

  constructor(private readonly page: Page) {
    this.taskInput = page.getByRole('textbox', {
      name: boardLocators.taskInputPlaceholder,
    });
    this.addButton = page.getByRole('button', {
      name: boardLocators.addButtonName,
    });
  }

  async addTask(taskTitle: string): Promise<void> {
    await this.taskInput.fill(taskTitle);
    await this.addButton.click();
  }

  getTaskByTitle(taskTitle: string) {
    return this.page.getByText(taskTitle, { exact: true });
  }
}

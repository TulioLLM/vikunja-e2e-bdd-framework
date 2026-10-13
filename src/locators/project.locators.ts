/** Accessible names and texts of the project List view (/projects/:id). */
export const projectLocators = {
  taskInputName: 'Add a task…',
  addTaskButtonName: 'Add',
  emptyTitleError: 'Please specify a title.',
  doneCheckboxName: (taskTitle: string) => `Mark '${taskTitle}' as done`,
};

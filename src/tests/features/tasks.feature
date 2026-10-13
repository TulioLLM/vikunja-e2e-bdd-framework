@tasks @E2E
Feature: Task management in a project
  As a Vikunja user
  I want to manage the tasks of my project
  So that I can keep track of my work

  Background:
    Given the user has a project named "E2E Project"

  @smoke
  Scenario: Add a new task
    When the user adds the task "Write the first E2E test"
    Then the task "Write the first E2E test" is shown in the project

  Scenario Outline: Add tasks with different kinds of titles
    When the user adds the task "<title>"
    Then the task "<title>" is shown in the project

    Examples:
      | title                                                                                        |
      | Revisar la configuración del módulo de facturación                                           |
      | Ship the release 🚀 and celebrate                                                            |
      | Update file C:/temp/report_v2.txt (copy) [draft] & notify                                   |
      | A deliberately long task title used to check that long text is stored and displayed in full |

  Scenario: Rename a task
    Given the project has a task "Old title"
    When the user renames the task "Old title" to "New title"
    Then the task "New title" is shown in the project
    And the task "Old title" is not shown in the project

  Scenario: Mark a task as done
    Given the project has a task "Finish me"
    When the user marks the task "Finish me" as done
    Then the task "Finish me" is marked as done

  Scenario: Delete a task
    Given the project has a task "Delete me"
    When the user deletes the task "Delete me"
    Then the task "Delete me" is not shown in the project

  Scenario: A blank title does not create a task
    When the user adds the task "   "
    Then the user is asked to specify a title
    And the project has no tasks

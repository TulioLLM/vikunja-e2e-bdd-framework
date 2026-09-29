@tasks @E2E @custom-test-tag
Feature: Gestión de tareas en un proyecto

  Background:
    Given el usuario tiene un proyecto llamado "Proyecto E2E"

  @smoke
  Scenario: Agregar una tarea nueva al proyecto
    When el usuario agrega la tarea "Escribir el primer test E2E"
    Then la tarea "Escribir el primer test E2E" aparece en el tablero

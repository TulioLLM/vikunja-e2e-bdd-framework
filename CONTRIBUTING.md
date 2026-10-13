# Contributing Guidelines

## Before Writing Code

1. Ensure your local environment is healthy: `npm run env:up` (or `npm run smoke-check` if it is already running).
2. Evaluate scenario value: ensure new tests cover unique business risks rather than redundant steps.

## Scenario Construction Rules

1. Write `.feature` files in English using clear Gherkin readable by non-technical stakeholders.
2. Maintain strict step separation: `Given` (state setup via API), `When` (primary action), `Then` (explicit assertion).
3. Seed test data through the `api` fixture (`VikunjaClient` in `src/api/vikunjaClient.ts`), never through the UI.
4. Create projects only through `api.createProject()` — the client tracks them and deletes them on teardown.
5. Share state between steps through the `ctx` fixture (`ScenarioContext`), not module-level variables.
6. Steps use the injected page objects (`projectPage`, `taskDetailPage`); never call `page.locator()` in steps.

## Naming Conventions

| Artifact        | Convention           | Example                   |
| --------------- | -------------------- | ------------------------- |
| `.feature` file | kebab-case           | `tasks.feature`           |
| Step definition | `<name>.steps.ts`    | `tasks.steps.ts`          |
| Page Object     | `<area>.page.ts`     | `task-detail.page.ts`     |
| Locators        | `<area>.locators.ts` | `task-detail.locators.ts` |

## Adding a Page Object

1. Put accessible names/texts in `src/locators/<area>.locators.ts`.
2. Build locators with `getByRole` / `getByText` / `getByLabel` in `src/pages/<area>.page.ts`.
3. Register it as a fixture in `src/tests/fixtures/test.fixture.ts` so steps can receive it.

## Pre-PR Quality Checklist

- [ ] `npm run check` passes (lint, typecheck, Prettier)
- [ ] `npm test` passes locally
- [ ] Automated teardown is confirmed for all created resources
- [ ] Assertions validate exact expected values

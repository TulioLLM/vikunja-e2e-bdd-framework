# Contributing Guidelines

## Before Writing Code

1. Ensure your local environment is healthy: `npx tsx scripts/smoke-check.ts`.
2. Evaluate scenario value: ensure new tests cover unique business risks rather than redundant steps.

## Scenario Construction Rules

1. Write `.feature` files using clear Gherkin syntax readable by non-technical stakeholders.
2. Maintain strict step separation: `Given` (state setup via API), `When` (primary action), `Then` (explicit assertion).
3. Always seed test data programmatically using `src/api/vikunjaClient.ts`.
4. Register created resources in `testContext` to guarantee automated teardown.

## Naming Conventions

| Artifact        | Convention           | Example             |
| --------------- | -------------------- | ------------------- |
| `.feature` file | kebab-case           | `tasks.feature`     |
| Step definition | `<name>.steps.ts`    | `tasks.steps.ts`    |
| Page Object     | `<area>.page.ts`     | `board.page.ts`     |
| Locators        | `<area>.locators.ts` | `board.locators.ts` |

## Pre-PR Quality Checklist

- [ ] `npm run lint` passes with 0 errors
- [ ] `npm test` passes locally
- [ ] Automated teardown is confirmed for all created resources
- [ ] Assertions validate exact expected values

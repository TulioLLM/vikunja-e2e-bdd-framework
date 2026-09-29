# Vikunja E2E BDD Framework

End-to-End Automation Framework built with **Playwright**, **TypeScript**, and **BDD (playwright-bdd)** targeting [Vikunja](https://vikunja.io) (open-source task manager) running in local Docker containers.

## Prerequisites

- Docker Desktop
- Node.js (exact version specified in `.nvmrc`)

## Environment Setup

```bash
docker compose up -d
npx tsx scripts/smoke-check.ts   # Confirms Vikunja API responsiveness
Running Tests
npm test                # Generates BDD code and executes the full suite
npm run test:headed     # Runs tests with visible browser
npm run test:ui         # Runs Playwright interactive UI mode
Project Structure
src/
├── api/                  # Vikunja API client (data setup and cleanup)
├── pages/                # Page Objects (UI actions, no assertions)
├── locators/             # Centralized element selectors
└── tests/
    ├── features/         # Gherkin scenario specifications (.feature)
    ├── step-definitions/ # Given/When/Then implementations
    └── fixtures/         # Dependency injection (context, session, API)
Tags
Tag
Scope
@smoke
Critical regression scenarios
@tasks
Task management feature suite
npx playwright test --grep @smoke
Contributing
See CONTRIBUTING.md for guidelines.
```

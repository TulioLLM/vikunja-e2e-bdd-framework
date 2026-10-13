# Vikunja E2E BDD Framework

End-to-end automation framework built with **Playwright**, **TypeScript** and **BDD ([playwright-bdd](https://github.com/vitalets/playwright-bdd))** targeting [Vikunja](https://vikunja.io), an open-source task manager running in local Docker containers.

## Prerequisites

- Windows with Docker Desktop (WSL2 backend)
- Node.js — version pinned in [`.nvmrc`](.nvmrc) (`nvm use`)
- Chromium is the only browser under test

## Getting started

Commands work in PowerShell or Git Bash:

```bash
npm ci
npx playwright install chromium
copy .env.example .env   # then set VIKUNJA_SERVICE_SECRET
npm run env:up           # starts Vikunja + Postgres and waits until the API answers
npm test
```

## Configuration

Both Docker Compose and the test suite read `.env` (see [`.env.example`](.env.example)):

| Variable                 | Default                 | Purpose                                          |
| ------------------------ | ----------------------- | ------------------------------------------------ |
| `VIKUNJA_SERVICE_SECRET` | — (required)            | Secret Vikunja uses to sign JWTs                 |
| `BASE_URL`               | `http://127.0.0.1:3456` | Vikunja instance under test                      |
| `WORKERS`                | `1`                     | Parallel Playwright workers (see the note below) |

> **Why one worker?** Docker Desktop's port forwarding drops connections
> (`ERR_EMPTY_RESPONSE`, `ERR_SOCKET_NOT_CONNECTED`) when several browser processes load the app
> at the same time, so the suite runs serially. Keep `WORKERS=1` unless Playwright itself runs
> inside the Docker network.

## npm scripts

| Script                    | What it does                                               |
| ------------------------- | ---------------------------------------------------------- |
| `npm test`                | Generates BDD specs and runs the full suite                |
| `npm run test:smoke`      | Runs only `@smoke` scenarios                               |
| `npm run test:headed`     | Runs with a visible browser                                |
| `npm run test:ui`         | Opens Playwright UI mode                                   |
| `npm run report`          | Opens the last HTML report                                 |
| `npm run env:up`          | Starts the Docker environment and runs the smoke check     |
| `npm run env:down`        | Stops the environment **and deletes its volumes**          |
| `npm run env:purge-users` | Deletes leftover test users (`e2e_*`, `smoke_test_*`)      |
| `npm run smoke-check`     | Checks that the Vikunja API can register and log in a user |
| `npm run check`           | Lint + typecheck + Prettier check (run before every PR)    |

Run any tag expression with `npx bddgen && npx playwright test --grep "@tasks"`.

## Project structure

```text
src/
├── api/                  # VikunjaClient: API data setup and automatic teardown
├── config/               # env.ts: single source for URLs and runtime settings
├── locators/             # Accessible names/texts used by page objects
├── pages/                # Page Objects (UI actions, no assertions)
├── support/              # testUserCleanup.ts: deletes test users via the Vikunja CLI
└── tests/
    ├── features/         # Gherkin scenarios (.feature)
    ├── step-definitions/ # Given/When/Then bindings (call page objects + API client)
    ├── fixtures/         # Typed fixture chain: ctx → api → authenticatedPage → page objects
    └── global-teardown.ts
scripts/
├── smoke-check.ts        # Environment readiness check
└── purge-test-users.ts   # Manual cleanup of leftover test users
```

### How a scenario runs

1. `api` registers a **fresh user per test** through the REST API and logs in.
2. `authenticatedPage` injects that user's token into `localStorage` — no UI login.
3. Steps seed data through `api` (e.g. `createProject`, `createTask`) and drive the UI through page objects.
4. On teardown, `api.cleanup()` deletes every project created through the client (and its tasks).
5. After the run, a global teardown deletes the test users themselves (and anything they still
   own), so the local database doesn't grow. Vikunja's API can't delete users without e-mail
   confirmation, so this uses `docker compose exec vikunja … user delete --now`. It is skipped
   on CI, where the database volume is discarded anyway. If a run is interrupted, use
   `npm run env:purge-users`.

## Tags

| Tag      | Scope                                  |
| -------- | -------------------------------------- |
| `@E2E`   | Every end-to-end scenario (CI default) |
| `@smoke` | Critical, fast scenarios               |
| `@tasks` | Task management feature                |

## Debugging failures

Failed tests keep a trace, video and screenshot in `test-results/`.

```bash
npm run report                                   # HTML report with attachments
npx playwright show-trace test-results/<test>/trace.zip
```

## Troubleshooting / known behaviors

Findings from running the suite against Vikunja 2.6.0 on Windows + Docker Desktop.

| Symptom                                                                                                                                           | Cause                                                                                                                                                             | What we do                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages stuck on _"Vikunja is loading…"_; assets fail with `ERR_EMPTY_RESPONSE` / `ERR_SOCKET_NOT_CONNECTED` when running with more than one worker | Docker Desktop's port forwarding drops connections when several browser processes load the app at once (the same load from inside the Docker network never fails) | `WORKERS` defaults to `1` ([`src/config/env.ts`](src/config/env.ts)). Don't raise it to "fix" flakiness                                                   |
| `429 Too Many Requests` on `/register` or `/login`                                                                                                | Vikunja rate-limits unauthenticated routes (default ~10 req/min); every test registers and logs in its own user                                                   | `VIKUNJA_RATELIMIT_NOAUTHLIMIT` is raised in [`docker-compose.yml`](docker-compose.yml). Recreate the container (`docker compose up -d`) if you change it |
| Strict-mode violation: `getByRole('button', { name: 'Add' })` resolves to 2 elements                                                              | Role names match by substring, so `Add` also matches each task's **Add to Favorites** button                                                                      | Use `exact: true` whenever a name is a prefix of another                                                                                                  |
| `check()` on a task's done checkbox times out (_"element is outside of the viewport"_)                                                            | The native checkbox is visually hidden (`sr-only`); users click its wrapping `<label>`                                                                            | `ProjectPage.markDone()` clicks the label                                                                                                                 |
| `401` on `/api/v1` and `/api/v2` `/user/token/refresh` in browser and server logs                                                                 | The frontend tries to refresh a session that was created through the API (no refresh cookie)                                                                      | Expected noise; tests are unaffected                                                                                                                      |
| `422 validation failed` / `unexpected property` from the API                                                                                      | API v2 rejects unknown fields (e.g. sending `email` to `/login`)                                                                                                  | Send only the fields in the OpenAPI spec: `http://127.0.0.1:3456/api/v2/openapi.json`                                                                     |
| Users can't be deleted through the API                                                                                                            | Self-deletion needs e-mail confirmation and `/admin/users` needs a Vikunja Pro license                                                                            | Test users are removed with the Vikunja CLI after each run (see [How a scenario runs](#how-a-scenario-runs))                                              |

## CI

[`.github/workflows/e2e-ci.yml`](.github/workflows/e2e-ci.yml) is triggered manually
(**Actions → E2E Regression Suite → Run workflow**) with a tag expression. It runs static
checks, starts the Docker environment, executes the selected scenarios and uploads the HTML
report (plus traces on failure).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md).

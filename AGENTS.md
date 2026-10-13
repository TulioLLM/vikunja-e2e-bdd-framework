# 🤖 AI Agents Architecture & Governance Guide

This repository hosts an E2E test automation framework built with **Playwright**, **TypeScript**, and **playwright-bdd** targeting **Vikunja** (REST API v2).

All AI-generated code MUST strictly adhere to these architectural rules:

---

## 1. Layered Architecture Rules

- **`src/tests/features/*.feature`**: Gherkin scenario specifications, written in English. No UI implementation details.
- **`src/tests/step-definitions/*.steps.ts`**: Step binding logic. Invokes injected Page Objects and the `api` client only. Never use `page.locator()` directly inside steps.
- **`src/tests/fixtures/test.fixture.ts`**: Single typed fixture chain (`ctx` → `api` → `authenticatedPage` → page objects).
- **`src/pages/*.page.ts`**: UI interaction logic and high-level methods. No assertions.
- **`src/locators/*.locators.ts`**: Isolated, exported accessible names and texts.
- **`src/api/vikunjaClient.ts`**: `VikunjaClient` over Playwright's `APIRequestContext` for background state setup and teardown.
- **`src/config/env.ts`**: The only place that reads environment variables or defines URLs.

---

## 2. Automation Conventions

1. **Accessible Selectors First**: Use `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`. Pass `exact: true` when a name is a prefix of another (e.g. `Add` vs `Add to Favorites`).
2. **No Arbitrary Delays**: Never use `page.waitForTimeout()` (lint error). Rely on web-first assertions, `locator.waitFor()` or `page.waitForURL()`.
3. **State Pre-seeding**: Always seed users and projects via API, never through UI login automation in every test.
4. **Automatic Teardown**: Create projects only via `api.createProject()` so `api.cleanup()` removes them.

---

## 3. Code Standards

- Strict TypeScript mode; `npm run typecheck` must pass.
- No `any` (lint error).
- Code, comments, error messages and docs in English.
- Execute `npm run check` prior to submitting code changes.

# 🤖 AI Agents Architecture & Governance Guide

This repository hosts an E2E test automation framework built with **Playwright**, **TypeScript**, and **playwright-bdd** targeting **Vikunja**.

All AI-generated code MUST strictly adhere to these architectural rules:

---

## 1. Layered Architecture Rules

- **`src/tests/features/*.feature`**: Gherkin scenario specifications. No UI implementation details.
- **`src/tests/step-definitions/*.steps.ts`**: Step binding logic. Invokes Page Objects only. Never use `page.locator()` directly inside steps.
- **`src/pages/*.page.ts`**: UI interaction logic and high-level methods.
- **`src/locators/*.locators.ts`**: Isolated, exported locator constants.
- **`src/api/vikunjaClient.ts`**: Fast API client for background state setup and teardown.

---

## 2. Automation Conventions

1. **Accessible Selectors First**: Use `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`.
2. **No Arbitrary Delays**: Never use `page.waitForTimeout()`. Rely on Playwright web-first assertions.
3. **State Pre-seeding**: Always seed users and projects via API, never through UI login automation in every test.

---

## 3. Code Standards

- Strict TypeScript mode.
- Avoid `any` except during explicit fixture composition.
- Execute `npm run lint` prior to submitting code changes.

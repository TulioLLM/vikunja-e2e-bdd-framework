import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/**', '.features-gen/**', 'playwright-report/**', 'test-results/**', 'dist/**'],
  },
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tseslint, playwright },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      ...playwright.configs.recommended.rules,
      'playwright/no-focused-test': 'error',
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/prefer-web-first-assertions': 'error',
    },
  },
  {
    files: ['**/step-definitions/**/*.ts'],
    rules: { 'playwright/no-standalone-expect': 'off' },
  },
  prettier,
];

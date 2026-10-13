import { existsSync } from 'node:fs';

// Load a local .env (if present) without adding a dependency. Variables already
// set in the environment (e.g. by CI) take precedence.
if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const baseUrl = (process.env.BASE_URL ?? 'http://127.0.0.1:3456').replace(/\/+$/, '');

export const env = {
  isCI: !!process.env.CI,
  baseUrl,
  apiUrl: `${baseUrl}/api/v2`,
  // Defaults to 1: Docker Desktop's port forwarding (Windows/WSL2) drops connections when
  // several browser processes load the app at once. Raise it where the host can take it.
  workers: Number(process.env.WORKERS ?? 1),
} as const;

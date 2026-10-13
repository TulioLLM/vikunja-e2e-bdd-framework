import { env } from '../src/config/env.js';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function main(): Promise<void> {
  console.log(`Waiting for Vikunja at ${env.baseUrl}...`);
  await waitForServer();

  const suffix = Date.now();
  const username = `smoke_test_${suffix}`;
  const password = 'SmokeTest123!';
  const email = `smoke_${suffix}@example.test`;

  console.log('Registering a test user...');
  const registerRes = await fetch(`${env.apiUrl}/register`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ username, email, password }),
  });
  if (!registerRes.ok) {
    throw new Error(`Registration failed: ${registerRes.status} ${await registerRes.text()}`);
  }

  console.log('Logging in...');
  const loginRes = await fetch(`${env.apiUrl}/login`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ username, password }),
  });
  if (!loginRes.ok) {
    throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
  }

  const body = (await loginRes.json()) as { token?: string };
  if (!body.token) {
    throw new Error('Login returned 200 but no token');
  }

  console.log('✅ Vikunja is ready. Test user registered and authenticated.');
}

async function waitForServer(retries = 30, delayMs = 1000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${env.apiUrl}/info`);
      if (res.ok) return;
    } catch {
      // Server is not accepting connections yet; retry
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(`Vikunja did not respond after ${retries} attempts`);
}

main().catch((err: unknown) => {
  console.error('❌ Smoke check failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});

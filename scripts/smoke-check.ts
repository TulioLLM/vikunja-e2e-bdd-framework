const API_URL = 'http://127.0.0.1:3456/api/v2';

async function main() {
  console.log('Esperando a que Vikunja responda...');
  await waitForServer();

  const suffix = Date.now();
  const username = `smoke_test_${suffix}`;
  const password = 'SmokeTest123!';
  const email = `smoke_${suffix}@example.test`;

  console.log('Registrando usuario de prueba...');
  const registerRes = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!registerRes.ok) {
    throw new Error(`Registro falló: ${registerRes.status} ${await registerRes.text()}`);
  }

  console.log('Iniciando sesión...');
  const loginRes = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!loginRes.ok) {
    throw new Error(`Login falló: ${loginRes.status} ${await loginRes.text()}`);
  }

  const body = (await loginRes.json()) as { token?: string };
  if (!body.token) {
    throw new Error('Login respondió 200 pero sin token');
  }

  console.log('✅ Vikunja está listo. Usuario de prueba creado y autenticado.');
}

async function waitForServer(retries = 30, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://127.0.0.1:3456');
      if (res.ok || res.status === 404) return;
    } catch {
      // El servidor todavía no acepta conexiones, reintentar
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error('Vikunja no respondió después de 30 intentos');
}

main().catch((err) => {
  console.error('❌ Smoke check falló:', err.message);
  process.exit(1);
});

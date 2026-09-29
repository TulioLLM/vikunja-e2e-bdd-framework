const API_URL = 'http://127.0.0.1:3456/api/v2';

export interface VikunjaSession {
  username: string;
  token: string;
}

export interface VikunjaProject {
  id: number;
  title: string;
}

export async function registerAndLogin(): Promise<VikunjaSession> {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const username = `e2e_${suffix}`;
  const password = 'E2eTest123!';
  const email = `e2e_${suffix}@example.test`;

  const registerRes = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!registerRes.ok) {
    throw new Error(`No se pudo registrar el usuario: ${registerRes.status}`);
  }

  const loginRes = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!loginRes.ok) {
    throw new Error(`No se pudo iniciar sesión: ${loginRes.status}`);
  }

  const body = (await loginRes.json()) as { token: string };
  return { username, token: body.token };
}

export async function createProject(token: string, title: string): Promise<VikunjaProject> {
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    throw new Error(`No se pudo crear el proyecto "${title}": ${res.status}`);
  }
  return res.json();
}

export async function deleteProject(token: string, projectId: number): Promise<void> {
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  // Un 404 acá significa que el test ya lo borró — no es un error
  if (!res.ok && res.status !== 404) {
    throw new Error(`No se pudo borrar el proyecto ${projectId}: ${res.status}`);
  }
}

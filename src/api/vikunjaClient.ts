import type { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '@/config/env.js';

export interface VikunjaSession {
  username: string;
  token: string;
}

export interface VikunjaProject {
  id: number;
  title: string;
}

export interface VikunjaTask {
  id: number;
  title: string;
  done: boolean;
  project_id: number;
}

interface Paginated<T> {
  items: T[] | null;
  total: number;
}

const TEST_PASSWORD = 'E2eTest123!';

/**
 * Thin client over Vikunja's REST API (v2) used for test data setup and teardown.
 * Built on Playwright's APIRequestContext so every call shows up in traces.
 * Every project created through it is deleted by `cleanup()`.
 */
export class VikunjaClient {
  private readonly createdProjectIds = new Set<number>();

  private constructor(
    private readonly request: APIRequestContext,
    readonly session: VikunjaSession,
  ) {}

  /** Registers a brand-new user (isolated per test) and logs in. */
  static async register(request: APIRequestContext): Promise<VikunjaClient> {
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const username = `e2e_${suffix}`;

    await expectOk(
      await request.post(`${env.apiUrl}/register`, {
        data: { username, email: `${username}@example.test`, password: TEST_PASSWORD },
      }),
      `register user "${username}"`,
    );

    const loginRes = await request.post(`${env.apiUrl}/login`, {
      data: { username, password: TEST_PASSWORD },
    });
    await expectOk(loginRes, `log in as "${username}"`);
    const { token } = (await loginRes.json()) as { token: string };

    return new VikunjaClient(request, { username, token });
  }

  async createProject(title: string): Promise<VikunjaProject> {
    const res = await this.request.post(`${env.apiUrl}/projects`, {
      headers: this.authHeaders(),
      data: { title },
    });
    await expectOk(res, `create project "${title}"`);
    const project = (await res.json()) as VikunjaProject;
    this.createdProjectIds.add(project.id);
    return project;
  }

  async deleteProject(projectId: number): Promise<void> {
    const res = await this.request.delete(`${env.apiUrl}/projects/${projectId}`, {
      headers: this.authHeaders(),
    });
    // 404 means the test already removed it — not an error
    if (res.status() !== 404) {
      await expectOk(res, `delete project ${projectId}`);
    }
    this.createdProjectIds.delete(projectId);
  }

  async createTask(projectId: number, title: string): Promise<VikunjaTask> {
    const res = await this.request.post(`${env.apiUrl}/projects/${projectId}/tasks`, {
      headers: this.authHeaders(),
      data: { title },
    });
    await expectOk(res, `create task "${title}" in project ${projectId}`);
    return (await res.json()) as VikunjaTask;
  }

  /** Returns every task of the project, including done ones. */
  async listTasks(projectId: number): Promise<VikunjaTask[]> {
    const res = await this.request.get(`${env.apiUrl}/projects/${projectId}/tasks`, {
      headers: this.authHeaders(),
      params: { per_page: 50 },
    });
    await expectOk(res, `list tasks of project ${projectId}`);
    const body = (await res.json()) as Paginated<VikunjaTask>;
    return body.items ?? [];
  }

  async findTaskByTitle(projectId: number, title: string): Promise<VikunjaTask | undefined> {
    const tasks = await this.listTasks(projectId);
    return tasks.find((task) => task.title === title);
  }

  /** Deletes every project created through this client (and, with them, their tasks). */
  async cleanup(): Promise<void> {
    for (const id of [...this.createdProjectIds]) {
      await this.deleteProject(id);
    }
  }

  private authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.session.token}` };
  }
}

async function expectOk(res: APIResponse, action: string): Promise<void> {
  if (!res.ok()) {
    throw new Error(`Failed to ${action}: ${res.status()} ${await res.text()}`);
  }
}

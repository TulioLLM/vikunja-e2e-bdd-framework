import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

/** Usernames created by the suite (VikunjaClient) and by scripts/smoke-check.ts. */
export const TEST_USER_PATTERN = '^(e2e|smoke_test)_';

const CONCURRENCY = 4;

/**
 * Deletes Vikunja users whose username matches `pattern`, together with everything they own.
 *
 * Vikunja's REST API can't delete users without e-mail confirmation (and the admin API needs a
 * Pro license), so this goes through the Docker Compose environment: user ids come from Postgres
 * and each user is removed with the `vikunja user delete --now` CLI.
 */
export async function purgeTestUsers(pattern = TEST_USER_PATTERN): Promise<number> {
  const ids = await findUserIds(pattern);
  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    await Promise.all(ids.slice(i, i + CONCURRENCY).map(deleteUser));
  }
  return ids.length;
}

async function findUserIds(pattern: string): Promise<number[]> {
  // The pattern is passed as a psql variable (not interpolated into SQL) and read from stdin.
  const child = run(
    'docker',
    [
      'compose',
      'exec',
      '-T',
      'db',
      'psql',
      '-U',
      'vikunja',
      '-d',
      'vikunja',
      '-tA',
      '-v',
      `pattern=${pattern}`,
    ],
    { encoding: 'utf8' },
  );
  child.child.stdin?.end("select id from users where username ~ :'pattern' order by id;");
  const { stdout } = await child;
  return stdout.split(/\r?\n/).filter(Boolean).map(Number);
}

async function deleteUser(id: number): Promise<void> {
  await run('docker', [
    'compose',
    'exec',
    '-T',
    'vikunja',
    '/app/vikunja/vikunja',
    'user',
    'delete',
    String(id),
    '--now',
    '--confirm',
  ]);
}

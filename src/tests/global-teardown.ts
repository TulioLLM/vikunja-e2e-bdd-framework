import { env } from '@/config/env.js';
import { purgeTestUsers } from '@/support/testUserCleanup.js';

/** Removes the users created during the run so the local database doesn't keep growing. */
export default async function globalTeardown(): Promise<void> {
  // CI throws the whole database volume away after the run
  if (env.isCI) return;

  try {
    await purgeTestUsers();
  } catch (err) {
    console.warn(
      'Could not purge test users (is the Docker Compose environment running?):',
      err instanceof Error ? err.message : err,
    );
  }
}

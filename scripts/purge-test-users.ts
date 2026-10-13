import { purgeTestUsers, TEST_USER_PATTERN } from '../src/support/testUserCleanup.js';

// Usage: npm run env:purge-users [-- "<username regex>"]
const pattern = process.argv[2] ?? TEST_USER_PATTERN;

purgeTestUsers(pattern)
  .then((count) => console.log(`✅ Deleted ${count} user(s) matching /${pattern}/`))
  .catch((err: unknown) => {
    console.error('❌ Purge failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });

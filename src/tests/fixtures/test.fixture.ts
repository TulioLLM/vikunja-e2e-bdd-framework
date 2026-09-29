import { mergeTests } from '@playwright/test';
import { contextFixture } from '@fixtures/context.fixture.js';
import { apiFixture } from '@fixtures/api.fixture.js';
import { authFixture } from '@fixtures/auth.fixture.js';

/**
 * Orden de composición obligatorio:
 * 1. contextFixture SIEMPRE primero (provee testContext a las demás).
 * 2. apiFixture depende de testContext (para saber qué limpiar al final).
 * 3. authFixture depende de vikunjaSession (que provee apiFixture).
 */
export const test = mergeTests(contextFixture, apiFixture, authFixture);

export { expect } from '@playwright/test';

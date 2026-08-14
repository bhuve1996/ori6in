import type { AppConfig } from '@ori6in/config';
import type { Repositories } from './ports/index.js';
import { createPostgresRepositories } from './postgres/index.js';
import { createMongoRepositories } from './mongo/index.js';
import { createMemoryRepositories } from './memory/index.js';

/**
 * Creates repository implementations based on DATABASE_DRIVER.
 * Feature code must depend only on Repositories ports — never on pg/mongodb clients.
 */
export async function createRepositories(config: AppConfig): Promise<Repositories> {
  if (config.DATABASE_DRIVER === 'mongo') {
    return createMongoRepositories(config);
  }
  return createPostgresRepositories(config);
}

export {
  createPostgresRepositories,
  createMongoRepositories,
  createMemoryRepositories,
};
export type { Repositories } from './ports/index.js';
export * from './ports/index.js';

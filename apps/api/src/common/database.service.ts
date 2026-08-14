import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { loadConfig, type AppConfig } from '@ori6in/config';
import { createRepositories, type Repositories } from '@ori6in/db';

export const REPOSITORIES = Symbol('REPOSITORIES');
export const APP_CONFIG = Symbol('APP_CONFIG');

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly config: AppConfig;
  private repos!: Repositories;

  constructor() {
    this.config = loadConfig();
  }

  async init(): Promise<Repositories> {
    // Prefer configured driver; fall back to memory if DB is unreachable (local bootstrap).
    try {
      this.repos = await createRepositories(this.config);
    } catch (err) {
      console.warn(
        `[db] ${this.config.DATABASE_DRIVER} unavailable (${String(err)}). Using memory adapter.`,
      );
      const { createMemoryRepositories } = await import('@ori6in/db');
      this.repos = createMemoryRepositories();
    }
    return this.repos;
  }

  get repositories(): Repositories {
    return this.repos;
  }

  async onModuleDestroy() {
    await this.repos?.disconnect();
  }
}

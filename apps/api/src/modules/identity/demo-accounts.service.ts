import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { AppConfig } from '@ori6in/config';
import type { Repositories } from '@ori6in/db';
import { DEMO_ACCOUNTS } from '@ori6in/shared';
import { APP_CONFIG, REPOSITORIES } from '../../common/database.service';

@Injectable()
export class DemoAccountsService implements OnModuleInit {
  private readonly log = new Logger(DemoAccountsService.name);

  constructor(
    @Inject(REPOSITORIES) private readonly repos: Repositories,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  async onModuleInit() {
    if (!this.config.ENABLE_DEMO_LOGINS) {
      this.log.log('Demo logins disabled (ENABLE_DEMO_LOGINS=false)');
      return;
    }

    const passwordHash = await bcrypt.hash(DEMO_ACCOUNTS[0].password, 10);
    for (const account of DEMO_ACCOUNTS) {
      const existing = await this.repos.users.findByEmail(account.email);
      if (existing) {
        // Keep password in sync if the account already exists.
        await this.repos.users.update(existing.id, {
          passwordHash,
          emailVerified: true,
          fullName: account.fullName,
        });
        continue;
      }
      await this.repos.users.create({
        email: account.email,
        passwordHash,
        fullName: account.fullName,
        role: account.role,
        emailVerified: true,
      });
      this.log.log(`Seeded demo account ${account.email} (${account.role})`);
    }
    this.log.warn(
      'Demo logins are ENABLED. See docs/demo-logins.md — set ENABLE_DEMO_LOGINS=false to disable.',
    );
  }
}

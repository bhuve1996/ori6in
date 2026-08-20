import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { ComingSoonSignup, Repositories } from '@ori6in/db';
import { REPOSITORIES } from '../../common/database.service';
import {
  isOutboundMailConfigured,
  sendComingSoonLiveEmail,
} from '../../common/mailer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function serialize(row: ComingSoonSignup) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    announcedAt: row.announcedAt,
  };
}

@Injectable()
export class ComingSoonService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  async signup(input: { email?: string; name?: string }) {
    const email =
      typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    const name =
      typeof input.name === 'string' ? input.name.trim().slice(0, 80) : '';

    if (!EMAIL_RE.test(email)) {
      throw new BadRequestException('Enter a valid email');
    }

    const { signup, created } = await this.repos.comingSoonSignups.upsert({
      email,
      name: name || null,
    });

    return { ok: true as const, created, signup: serialize(signup) };
  }

  async listForAdmin() {
    const [items, total] = await Promise.all([
      this.repos.comingSoonSignups.listAll(1000),
      this.repos.comingSoonSignups.count(),
    ]);
    const pending = items.filter((s) => s.announcedAt == null).length;
    return {
      total,
      pending,
      items: items.map(serialize),
    };
  }

  async announceLive() {
    if (!isOutboundMailConfigured()) {
      throw new ServiceUnavailableException(
        'Outbound email is not configured on the API (SMTP or Resend).',
      );
    }

    const pending = await this.repos.comingSoonSignups.listPendingAnnounce(1000);
    if (pending.length === 0) {
      return { sent: 0, failed: 0, skipped: 0, failures: [] as string[] };
    }

    const sentIds: string[] = [];
    const failures: string[] = [];

    for (const row of pending) {
      try {
        await sendComingSoonLiveEmail({ email: row.email, name: row.name });
        sentIds.push(row.id);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'send failed';
        failures.push(`${row.email}: ${msg}`);
      }
    }

    if (sentIds.length > 0) {
      await this.repos.comingSoonSignups.markAnnounced(sentIds, new Date());
    }

    return {
      sent: sentIds.length,
      failed: failures.length,
      skipped: 0,
      failures,
    };
  }
}

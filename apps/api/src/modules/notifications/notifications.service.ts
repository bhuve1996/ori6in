import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import { REPOSITORIES } from '../../common/database.service';

@Injectable()
export class NotificationsService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  list(userId: string) {
    return this.repos.notifications.listForUser(userId);
  }

  async unreadCount(userId: string) {
    const count = await this.repos.notifications.countUnread(userId);
    return { count };
  }

  async markRead(userId: string, id: string) {
    const row = await this.repos.notifications.findById(id);
    if (!row) throw new NotFoundException('Notification not found');
    if (row.userId !== userId) throw new ForbiddenException();
    await this.repos.notifications.markRead(id);
    return { ok: true };
  }

  async markAllRead(userId: string) {
    const updated = await this.repos.notifications.markAllReadForUser(userId);
    return { ok: true, updated };
  }
}

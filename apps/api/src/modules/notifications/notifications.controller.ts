import { Controller, Get, Inject, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, type AuthUser } from '../rbac/rbac';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @Inject(NotificationsService) private readonly notifications: NotificationsService,
  ) {}

  @Get()
  list(@Req() req: { user: AuthUser }) {
    return this.notifications.list(req.user.sub);
  }

  @Get('unread-count')
  unreadCount(@Req() req: { user: AuthUser }) {
    return this.notifications.unreadCount(req.user.sub);
  }

  @Patch('read-all')
  markAllRead(@Req() req: { user: AuthUser }) {
    return this.notifications.markAllRead(req.user.sub);
  }

  @Patch(':id/read')
  markRead(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.notifications.markRead(req.user.sub, id);
  }
}

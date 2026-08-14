import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@ori6in/shared';
import { JwtAuthGuard, Roles, RolesGuard, type AuthUser } from '../rbac/rbac';
import { ParentPortalService } from './parent-portal.service';

@Controller('parent')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Parent)
export class ParentPortalController {
  constructor(@Inject(ParentPortalService) private readonly portal: ParentPortalService) {}

  @Get('dashboard')
  dashboard(@Req() req: { user: AuthUser }) {
    return this.portal.dashboard(req.user.sub);
  }

  @Get('progress')
  progress() {
    return this.portal.progress();
  }

  @Get('payments')
  payments() {
    return this.portal.payments();
  }

  @Get('messaging')
  messaging() {
    return this.portal.messaging();
  }

  @Get('approvals')
  approvals() {
    return this.portal.approvals();
  }

  @Post('approvals/:id/acknowledge')
  acknowledge(@Param('id') id: string, @Body() _body: unknown) {
    return this.portal.acknowledge(id);
  }
}

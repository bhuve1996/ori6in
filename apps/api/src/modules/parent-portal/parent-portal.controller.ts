import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Get('links')
  links(@Req() req: { user: AuthUser }) {
    return this.portal.listLinks(req.user.sub);
  }

  @Post('links')
  inviteLink(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.portal.inviteLink(req.user.sub, body);
  }

  @Post('links/:id/revoke')
  revokeLink(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.portal.revokeLink(req.user.sub, id);
  }

  @Get('progress')
  progress(@Req() req: { user: AuthUser }) {
    return this.portal.progress(req.user.sub);
  }

  @Get('payments')
  payments(@Req() req: { user: AuthUser }) {
    return this.portal.payments(req.user.sub);
  }

  @Post('payments/checkout')
  checkout(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.portal.checkoutAndPay(req.user.sub, body);
  }

  @Post('payments/:orderId/pay')
  payOrder(@Req() req: { user: AuthUser }, @Param('orderId') orderId: string) {
    return this.portal.payPendingOrder(req.user.sub, orderId);
  }

  @Get('messaging')
  messaging(@Req() req: { user: AuthUser }) {
    return this.portal.messaging(req.user.sub);
  }

  @Post('messaging')
  createThread(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.portal.createThread(req.user.sub, body);
  }

  @Get('messaging/:threadId')
  getThread(@Req() req: { user: AuthUser }, @Param('threadId') threadId: string) {
    return this.portal.getThread(req.user.sub, threadId);
  }

  @Post('messaging/:threadId/messages')
  sendMessage(
    @Req() req: { user: AuthUser },
    @Param('threadId') threadId: string,
    @Body() body: unknown,
  ) {
    return this.portal.sendMessage(req.user.sub, threadId, body);
  }

  @Get('approvals')
  approvals(@Req() req: { user: AuthUser }) {
    return this.portal.approvals(req.user.sub);
  }

  @Post('approvals/:id/decide')
  decide(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.portal.decideApproval(req.user.sub, id, body);
  }

  /** @deprecated Prefer decide — kept for older UI briefly. */
  @Post('approvals/:id/acknowledge')
  acknowledge(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
  ) {
    return this.portal.decideApproval(req.user.sub, id, { decision: 'approved' });
  }
}

@Controller('student/parent-links')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Student)
export class StudentParentLinksController {
  constructor(@Inject(ParentPortalService) private readonly portal: ParentPortalService) {}

  @Get()
  list(@Req() req: { user: AuthUser }) {
    return this.portal.listLinksForStudent(req.user.sub);
  }

  @Post(':id/accept')
  accept(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.portal.studentRespondToLink(req.user.sub, id, true);
  }

  @Post(':id/decline')
  decline(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.portal.studentRespondToLink(req.user.sub, id, false);
  }
}

import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { Role } from '@ori6in/shared';
import { JwtAuthGuard, Roles, RolesGuard } from '../rbac/rbac';
import { ComingSoonService } from './coming-soon.service';

@Controller('coming-soon')
export class ComingSoonPublicController {
  constructor(
    @Inject(ComingSoonService) private readonly comingSoon: ComingSoonService,
  ) {}

  /** Public waitlist signup (also used by the web /api/notify proxy). */
  @Post('signups')
  signup(@Body() body: { email?: string; name?: string }) {
    return this.comingSoon.signup(body);
  }
}

@Controller('admin/coming-soon-signups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.SuperAdmin)
export class AdminComingSoonController {
  constructor(
    @Inject(ComingSoonService) private readonly comingSoon: ComingSoonService,
  ) {}

  @Get()
  list() {
    return this.comingSoon.listForAdmin();
  }

  /** Email everyone still waiting that the site is live. */
  @Post('announce')
  announce() {
    return this.comingSoon.announceLive();
  }
}

import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { Role } from '@ori6in/shared';
import { JwtAuthGuard, Roles, RolesGuard, type AuthUser } from '../rbac/rbac';
import { CompanyPortalService } from './company-portal.service';

@Controller('company')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Company)
export class CompanyPortalController {
  constructor(@Inject(CompanyPortalService) private readonly portal: CompanyPortalService) {}

  @Get('dashboard')
  dashboard(@Req() req: { user: AuthUser }) {
    return this.portal.dashboard(req.user.sub);
  }

  @Get('internships')
  internships() {
    return this.portal.internships();
  }

  @Get('applicants')
  applicants() {
    return this.portal.applicants();
  }

  @Get('interviews')
  interviews() {
    return this.portal.interviews();
  }
}

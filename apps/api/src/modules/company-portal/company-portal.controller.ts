import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  internships(@Req() req: { user: AuthUser }) {
    return this.portal.internships(req.user.sub);
  }

  @Post('internships')
  createInternship(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.portal.createInternship(req.user.sub, body);
  }

  @Put('internships/:id')
  updateInternship(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.portal.updateInternship(req.user.sub, id, body);
  }

  @Post('internships/:id/pay')
  payInternship(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.portal.payForInternship(req.user.sub, id);
  }

  @Post('internships/:id/submit')
  submitInternship(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.portal.submitInternship(req.user.sub, id);
  }

  @Get('applicants')
  applicants(@Req() req: { user: AuthUser }) {
    return this.portal.applicants(req.user.sub);
  }

  @Patch('applicants/:id/status')
  updateApplicantStatus(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.portal.updateApplicantStatus(req.user.sub, id, body);
  }

  @Get('interviews')
  interviews(@Req() req: { user: AuthUser }) {
    return this.portal.interviews(req.user.sub);
  }
}

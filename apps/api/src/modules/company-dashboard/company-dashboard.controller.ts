import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('company/dashboard')
export class CompanyDashboardController {
  @Get()
  info() {
    return { module: 'company-dashboard', status: 'scaffold', phase: 'deferred' };
  }
}

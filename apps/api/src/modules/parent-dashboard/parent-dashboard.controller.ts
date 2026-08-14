import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('parent/dashboard')
export class ParentDashboardController {
  @Get()
  info() {
    return { module: 'parent-dashboard', status: 'scaffold', phase: 'deferred' };
  }
}

import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('analytics')
export class AnalyticsCoreController {
  @Get()
  info() {
    return { module: 'analytics-core', status: 'scaffold', phase: 'deferred' };
  }
}

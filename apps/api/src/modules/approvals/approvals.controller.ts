import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('approvals')
export class ApprovalsController {
  @Get()
  info() {
    return { module: 'approvals', status: 'scaffold', phase: 'deferred' };
  }
}

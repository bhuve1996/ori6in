import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('parent/payments')
export class ParentPaymentsController {
  @Get()
  info() {
    return { module: 'parent-payments', status: 'scaffold', phase: 'deferred' };
  }
}

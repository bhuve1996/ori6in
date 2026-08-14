import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('parent/approvals')
export class ParentApprovalsController {
  @Get()
  info() {
    return { module: 'parent-approvals', status: 'scaffold', phase: 'deferred' };
  }
}

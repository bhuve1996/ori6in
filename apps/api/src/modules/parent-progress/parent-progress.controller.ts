import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('parent/progress')
export class ParentProgressController {
  @Get()
  info() {
    return { module: 'parent-progress', status: 'scaffold', phase: 'deferred' };
  }
}

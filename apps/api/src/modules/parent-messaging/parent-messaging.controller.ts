import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('parent/messaging')
export class ParentMessagingController {
  @Get()
  info() {
    return { module: 'parent-messaging', status: 'scaffold', phase: 'deferred' };
  }
}

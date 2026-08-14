import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('community')
export class CommunityController {
  @Get()
  info() {
    return { module: 'community', status: 'scaffold', phase: 'deferred' };
  }
}

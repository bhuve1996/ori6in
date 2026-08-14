import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('super-admin')
export class SuperAdminController {
  @Get()
  info() {
    return { module: 'super-admin', status: 'scaffold', phase: 'deferred' };
  }
}

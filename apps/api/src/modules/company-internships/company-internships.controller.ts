import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('company/internships')
export class CompanyInternshipsController {
  @Get()
  info() {
    return { module: 'company-internships', status: 'scaffold', phase: 'deferred' };
  }
}

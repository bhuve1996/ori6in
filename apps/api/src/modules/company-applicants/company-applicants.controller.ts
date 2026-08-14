import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('company/applicants')
export class CompanyApplicantsController {
  @Get()
  info() {
    return { module: 'company-applicants', status: 'scaffold', phase: 'deferred' };
  }
}

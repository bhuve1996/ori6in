import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('ai/career-coach')
export class AiCareerCoachController {
  @Get()
  info() {
    return { module: 'ai-career-coach', status: 'scaffold', phase: 'deferred' };
  }
}

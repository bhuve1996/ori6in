import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('ai/roadmap')
export class AiRoadmapController {
  @Get()
  info() {
    return { module: 'ai-roadmap', status: 'scaffold', phase: 'deferred' };
  }
}

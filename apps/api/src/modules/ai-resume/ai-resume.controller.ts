import { Controller, Get } from '@nestjs/common';

/** Phase 2+ scaffold — not implemented in Month 1 MVP. */
@Controller('ai/resume')
export class AiResumeController {
  @Get()
  info() {
    return { module: 'ai-resume', status: 'scaffold', phase: 'deferred' };
  }
}

import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
  constructor(@Inject(ProgramsService) private readonly programs: ProgramsService) {}

  /** Phase 1: own published products only */
  @Get()
  list() {
    return this.programs.listPublishedOwn();
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.programs.getPublishedBySlug(slug);
  }
}

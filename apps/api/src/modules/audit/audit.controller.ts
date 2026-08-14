import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import { REPOSITORIES } from '../../common/database.service';

@Controller('audit')
export class AuditController {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  @Post()
  async append(
    @Body()
    body: {
      actorId: string;
      action: string;
      resourceType: string;
      resourceId?: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.repos.audit.append(body);
  }

  @Get()
  async list(@Query('actorId') actorId: string) {
    return this.repos.audit.listByActor(actorId);
  }
}

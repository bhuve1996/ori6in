import { Module } from '@nestjs/common';
import { AiRoadmapController } from './ai-roadmap.controller';

@Module({ controllers: [AiRoadmapController] })
export class AiRoadmapModule {}

import { Module } from '@nestjs/common';
import { AiCareerCoachController } from './ai-career-coach.controller';

@Module({ controllers: [AiCareerCoachController] })
export class AiCareerCoachModule {}

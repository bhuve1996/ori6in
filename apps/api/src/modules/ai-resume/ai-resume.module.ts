import { Module } from '@nestjs/common';
import { AiResumeController } from './ai-resume.controller';

@Module({ controllers: [AiResumeController] })
export class AiResumeModule {}

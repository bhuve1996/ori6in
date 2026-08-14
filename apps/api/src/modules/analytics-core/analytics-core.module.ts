import { Module } from '@nestjs/common';
import { AnalyticsCoreController } from './analytics-core.controller';

@Module({ controllers: [AnalyticsCoreController] })
export class AnalyticsCoreModule {}

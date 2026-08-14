import { Module } from '@nestjs/common';
import { ParentDashboardController } from './parent-dashboard.controller';

@Module({ controllers: [ParentDashboardController] })
export class ParentDashboardModule {}

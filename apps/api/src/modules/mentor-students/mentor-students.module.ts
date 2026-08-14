import { Module } from '@nestjs/common';
import { MentorDashboardModule } from '../mentor-dashboard/mentor-dashboard.module';

@Module({ imports: [MentorDashboardModule] })
export class MentorStudentsModule {}

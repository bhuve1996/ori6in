import { Module } from '@nestjs/common';
import { LearningModule } from '../learning/learning.module';
import { StudentDashboardController } from './student.controllers';

@Module({
  imports: [LearningModule],
  controllers: [StudentDashboardController],
})
export class StudentDashboardModule {}

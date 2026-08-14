import { Module } from '@nestjs/common';
import { LearningModule } from '../learning/learning.module';
import { LearningLessonsController } from '../student-dashboard/student.controllers';

@Module({
  imports: [LearningModule],
  controllers: [LearningLessonsController],
})
export class LearningLessonsModule {}

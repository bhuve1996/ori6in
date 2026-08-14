import { Module } from '@nestjs/common';
import { LearningModule } from '../learning/learning.module';
import { LearningCoursesController } from '../student-dashboard/student.controllers';

@Module({
  imports: [LearningModule],
  controllers: [LearningCoursesController],
})
export class LearningCoursesModule {}

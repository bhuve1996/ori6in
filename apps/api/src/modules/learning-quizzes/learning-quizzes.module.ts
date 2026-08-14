import { Module } from '@nestjs/common';
import { LearningQuizzesController } from '../student-dashboard/student.controllers';

@Module({ controllers: [LearningQuizzesController] })
export class LearningQuizzesModule {}

import { Module } from '@nestjs/common';
import { LearningAssignmentsController } from '../student-dashboard/student.controllers';

@Module({ controllers: [LearningAssignmentsController] })
export class LearningAssignmentsModule {}

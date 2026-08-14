import { Module } from '@nestjs/common';
import { MentorsModule } from '../mentors/mentors.module';

/** Mentor portal routes live in MentorsModule. */
@Module({ imports: [MentorsModule] })
export class MentorDashboardModule {}

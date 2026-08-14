import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { MentorsDirectoryController } from './mentors-directory.controller';

@Module({
  imports: [AdminModule],
  controllers: [MentorsDirectoryController],
})
export class MentorsDirectoryModule {}

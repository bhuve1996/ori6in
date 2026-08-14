import { Module } from '@nestjs/common';
import { StudentProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [StudentProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class StudentProfileModule {}

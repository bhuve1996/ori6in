import { Module } from '@nestjs/common';
import {
  AdminComingSoonController,
  ComingSoonPublicController,
} from './coming-soon.controller';
import { ComingSoonService } from './coming-soon.service';

@Module({
  controllers: [ComingSoonPublicController, AdminComingSoonController],
  providers: [ComingSoonService],
  exports: [ComingSoonService],
})
export class ComingSoonModule {}

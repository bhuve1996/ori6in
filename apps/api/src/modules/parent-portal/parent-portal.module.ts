import { Module } from '@nestjs/common';
import {
  ParentPortalController,
  StudentParentLinksController,
} from './parent-portal.controller';
import { ParentPortalService } from './parent-portal.service';

@Module({
  controllers: [ParentPortalController, StudentParentLinksController],
  providers: [ParentPortalService],
  exports: [ParentPortalService],
})
export class ParentPortalModule {}

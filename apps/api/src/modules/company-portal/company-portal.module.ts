import { Module } from '@nestjs/common';
import { CompanyPortalController } from './company-portal.controller';
import { CompanyPortalService } from './company-portal.service';

@Module({
  controllers: [CompanyPortalController],
  providers: [CompanyPortalService],
})
export class CompanyPortalModule {}

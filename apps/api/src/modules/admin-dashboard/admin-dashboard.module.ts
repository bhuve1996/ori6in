import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { CmsModule } from '../cms/cms.module';
import { CompanyPortalModule } from '../company-portal/company-portal.module';
import { ProgramsModule } from '../programs/programs.module';
import {
  AdminApprovalsController,
  AdminCatalogController,
  AdminCmsController,
  AdminDashboardController,
  AdminImpersonationController,
  AdminUsersController,
} from './admin.controllers';

@Module({
  imports: [AdminModule, ProgramsModule, CmsModule, CompanyPortalModule],
  controllers: [
    AdminDashboardController,
    AdminUsersController,
    AdminCatalogController,
    AdminCmsController,
    AdminImpersonationController,
    AdminApprovalsController,
  ],
})
export class AdminDashboardModule {}
